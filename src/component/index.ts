import Chart, { ChartConfiguration, ChartItem } from 'chart.js/auto';
import { Client } from '@relevanceai/chain';
import ChartGeneratorTemplate from '../chains/template';

export default class MagicChart {
  #item: ChartItem;
  #results: any[];
  #region: string;
  #project: string;
  #chainId: string;
  #configOverwrite?: ChartConfiguration;
  #relevanceClient: Client;

  /**
   * 
   * @param item The canvas element or context to render the chart on
   * @param results An array of results for MagicChart to convert into a chart configuration
   * @param options Explicitly overwrite the magic chart configuration
   * @param options.region Relevance AI region
   * @param options.project Relevance AI project
   * @param options.chainId Relevance AI chainId
   * @param options.configOverwrite Explicitly overwrite the magic chart configuration
   */
  constructor(item: ChartItem, results: any[], {
    region,
    project,
    chainId = 'magic-chart-js',
    configOverwrite
  }: {
      region: string;
      project: string;
      chainId?: string;
      configOverwrite?: ChartConfiguration;
  }) {
      this.#item = item;    
      this.#results = results;
      this.#region = region;
      this.#project = project;
      this.#chainId = chainId;
      this.#configOverwrite = configOverwrite;

      // Set up Relevance AI client
      this.#relevanceClient = new Client({
        region: this.#region,
        project: this.#project,
      });
  }

  async summonChart() {
    if (this.#configOverwrite) {
      return new Chart(this.#item, this.#configOverwrite);
    }

    const { chartConfiguration } = await this.#relevanceClient.runChain<typeof ChartGeneratorTemplate>(this.#chainId,{
      results: this.#results,
    });

    return new Chart(this.#item, JSON.parse(chartConfiguration));
  }
}