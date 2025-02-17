'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ResearchResult {
  content: string;
  sources: string[];
  relatedTopics: string[];
  confidence: number;
  knowledgeGraph?: {
    nodes: Array<{
      id: string;
      label: string;
      type: 'concept' | 'fact' | 'source';
    }>;
    edges: Array<{
      from: string;
      to: string;
      label: string;
    }>;
  };
}

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
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height].join(' '))
      .attr('class', 'bg-white dark:bg-gray-800 rounded-lg');

    // Create links
    const link = svg.selectAll('.link')
      .data(links)
      .enter()
      .append('g')
      .attr('class', 'link');

    const lines = link.append('line')
      .attr('class', 'graph-link stroke-gray-300 dark:stroke-gray-600')
      .attr('stroke-width', 1);

    const linkLabels = link.append('text')
      .attr('class', 'graph-label fill-gray-500 dark:fill-gray-400 text-xs')
      .attr('text-anchor', 'middle')
      .text(d => d.label);

    // Create nodes
    const node = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node cursor-pointer')
      .call(d3.drag<SVGGElement, SimNode>()
        .on('start', dragStarted)
        .on('drag', dragging)
        .on('end', dragEnded));

    node.append('circle')
      .attr('r', 5)
      .attr('class', d => `fill-current ${getNodeColorClass(d.type)}`);

    node.append('text')
      .attr('x', 8)
      .attr('y', 3)
      .attr('class', 'fill-current text-gray-700 dark:text-gray-300 text-sm')
      .text(d => d.label);

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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Research Results
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {research.content}
        </p>
      </div>

      {research.knowledgeGraph && (
        <div>
          <h4 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">
            Knowledge Graph
          </h4>
          <div className="border rounded-lg dark:border-gray-700">
            <svg ref={svgRef}></svg>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">
          Related Topics
        </h4>
        <div className="flex flex-wrap gap-2">
          {research.relatedTopics.map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900 
                       text-blue-800 dark:text-blue-200 rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">
          Sources
        </h4>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
          {research.sources.map((source, index) => (
            <li key={index}>{source}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function getNodeColorClass(type: 'concept' | 'fact' | 'source'): string {
  switch (type) {
    case 'concept':
      return 'text-blue-500';
    case 'fact':
      return 'text-green-500';
    case 'source':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
}