import { useEffect, useRef } from 'react';
import { ResearchResult } from '../services/ResearchService';
import * as d3 from 'd3';

interface ResearchVisualizationProps {
  research: ResearchResult;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'concept' | 'fact' | 'source';
}

interface SimLink {
  source: SimNode;
  target: SimNode;
  label: string;
}

export function ResearchVisualization({ research }: ResearchVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !research.knowledgeGraph) return;

    const width = 600;
    const height = 400;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Create nodes with simulation properties
    const nodes: SimNode[] = research.knowledgeGraph.nodes.map(node => ({
      ...node,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: undefined,
      vy: undefined,
      fx: undefined,
      fy: undefined,
    }));

    // Create map of nodes by ID for easy lookup
    const nodeById = new Map(nodes.map(node => [node.id, node]));

    // Create links with references to actual nodes
    const links: SimLink[] = research.knowledgeGraph.edges.map(edge => ({
      source: nodeById.get(edge.from)!,
      target: nodeById.get(edge.to)!,
      label: edge.label,
    }));

    // Create force simulation
    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links)
        .id(d => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create SVG elements
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create edges
    const link = svg.selectAll('.link')
      .data(links)
      .enter()
      .append('g')
      .attr('class', 'link');

    const lines = link.append('line')
      .style('stroke', '#999')
      .style('stroke-width', 1);

    const linkLabels = link.append('text')
      .text(d => d.label)
      .attr('font-size', '8px')
      .attr('text-anchor', 'middle');

    // Create nodes
    const node = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, SimNode>()
        .on('start', dragStarted)
        .on('drag', dragging)
        .on('end', dragEnded));

    node.append('circle')
      .attr('r', 5)
      .style('fill', d => getNodeColor(d.type));

    node.append('text')
      .text(d => d.label)
      .attr('x', 8)
      .attr('y', 3)
      .style('font-size', '10px');

    // Update positions on each tick
    simulation.on('tick', () => {
      lines
        .attr('x1', d => d.source.x!)
        .attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!)
        .attr('y2', d => d.target.y!);

      linkLabels
        .attr('x', d => (d.source.x! + d.target.x!) / 2)
        .attr('y', d => (d.source.y! + d.target.y!) / 2);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragStarted(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragging(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragEnded(event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [research.knowledgeGraph]);

  return (
    <div className="research-visualization">
      <h3 className="text-lg font-bold mb-4">Research Results</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">Summary</h4>
        <p className="text-sm">{research.content}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Knowledge Graph</h4>
        <svg ref={svgRef} className="border rounded"></svg>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Sources</h4>
        <ul className="text-sm list-disc list-inside">
          {research.sources.map((source, index) => (
            <li key={index}>{source}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Related Topics</h4>
        <div className="flex flex-wrap gap-2">
          {research.relatedTopics.map((topic, index) => (
            <span key={index} className="px-2 py-1 text-sm bg-gray-100 rounded">
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function getNodeColor(type: string): string {
  switch (type) {
    case 'concept':
      return '#4299e1'; // blue
    case 'fact':
      return '#48bb78'; // green
    case 'source':
      return '#ed8936'; // orange
    default:
      return '#a0aec0'; // gray
  }
}