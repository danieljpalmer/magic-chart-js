import Chart, { ChartConfiguration, ChartItem } from 'chart.js/auto';
import { Client } from '@relevanceai/chain';
import ChartGeneratorTemplate from '../chains/template';

export default class MagicChart {
  #region: string;
  #project: string;
  #chainId: string;
  #relevanceClient: Client;

  /**
   * 
   * @param options.region Relevance AI region
   * @param options.project Relevance AI project
   * @param options.chainId Relevance AI chainId
   */
  constructor({
    region,
    project,
    chainId = 'magic-chart-js',
  }: {
      region: string;
      project: string;
      chainId?: string;
  }) {
      this.#region = region;
      this.#project = project;
      this.#chainId = chainId;

      // Set up Relevance AI client
      this.#relevanceClient = new Client({
        region: this.#region,
        project: this.#project,
      });
  }

  async summonChart({
    item,
    results,
    prompt = '',
    configOverwrite
  }: {
      item: ChartItem;
      results: any[];
      prompt: string;
      configOverwrite?: ChartConfiguration;
  }) {
    if (configOverwrite) {
      return new Chart(item, configOverwrite);
    }

    const { chartConfiguration } = await this.#relevanceClient.runChain<typeof ChartGeneratorTemplate>(this.#chainId,{
      results,
      prompt
    });

    return new Chart(item, JSON.parse(chartConfiguration));
  }
}