import { defineChain } from '@relevanceai/chain';
export default defineChain({
  publiclyTriggerable: true,
  params: {
    results: {
      type: 'array',
    },
  },
  setup({ params, step, code }) {

    const { results } = params;

    const { answer: typeOfChart } = step('prompt_completion', {
      prompt: `Here is some sample data: ${results[0]}.
      
These are the types of charts you know how to create: 'bar', 'doughnut', 'line', 'bubble' and 'radar'.

Identify and respond with the type of chart that would be most appropriate for this request.`,
      system_prompt: 'You are a Chart.js expert. You select the most appropriate chart types based on data you see. You do not respond with anything except the chart type. No need to explain your reasoning.',
    });

    const {
      transformed: exampleCode
    } = code({ typeOfChart }, ({ typeOfChart }) => {

      const examples: Record<string, any> = {
        line: `{
  type: 'line',
  data: data: {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
},
  options: {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true
      }
    }
  }
}`,
        bar: `{
  type: 'bar',
  data: {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
    ],
    borderWidth: 1
  }]
},
  options: {
    indexAxis: 'y',
  }
};`,
        doughnut: `{
  type: 'doughnut',
  data: {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
},
}`,
        bubble: `{
  datasets: [{
    label: 'First Dataset',
    data: [{
      x: 20,
      y: 30,
      r: 15
    }, {
      x: 40,
      y: 10,
      r: 10
    }],
    backgroundColor: 'rgb(255, 99, 132)'
  }]
}`,
        radar: `{
  type: 'radar',
  data: {
  labels: [
    'Eating',
    'Drinking',
    'Sleeping',
    'Designing',
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 90, 81, 56, 55, 40],
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  }, {
    label: 'My Second Dataset',
    data: [28, 48, 40, 19, 96, 27, 100],
    fill: true,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgb(54, 162, 235)',
    pointBackgroundColor: 'rgb(54, 162, 235)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(54, 162, 235)'
  }]
},
  options: {
    elements: {
      line: {
        borderWidth: 3
      }
    }
  },
}`
      };

      return examples[typeOfChart] ?? examples.bar;

    });

    const { answer: chartConfiguration } = step('prompt_completion', {
      prompt: `Here is an example ChartJS config:

${exampleCode}
            
Create a chartjs.org chart of type ${typeOfChart} that would be appropriate for the following data. It should include the results.

Here are the results:

${results}
`,
      system_prompt: 'You are an expert ChartJS config creator. You must only return valid JSON chart.js configurations. Never provide any explanations or other data.'
    });


    const { transformed: cleanedConfiguration } = code({ chartConfiguration }, ({ chartConfiguration }) => {
      // strip of line breaks
      return chartConfiguration.replace(/(\r\n|\n|\r)/gm, " ").replace(/\\/g, '');
    });

    return {
      chartConfiguration: cleanedConfiguration
    }
  }
})


