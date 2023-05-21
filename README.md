# ✨ Magic Chart.js
A proof of concept wrapper around [Chart.js](https://github.com/chartjs/Chart.js) that uses an LLM to generate the chart, based on the data you want to display.

Simply pass in `results` to the chart and the LLM will decide how to display them! You can also pass in instructions via the `prompt`, if you have something in mind.

This is currently very much a proof of concept! I have a few ideas for how to significantly improve this through better chains, that I will implement when I get the chance!

[**Watch demo!**](https://www.loom.com/share/e70f8a29eb8f492f88b3d9ae0ea2c661)

## Setting up

Start by installing this library:

```bash
npm i magic-chart-js
```

To power the LLM features, you'll have to set up [Relevance AI](https://documentation.relevanceai.com/introduction).

To do this, you'll need to install the Relevance AI SDK:

```bash
npm i -g @relevanceai/chain
relevance login
```

Create a chains folder at the root of your project, and create a file called `magic-chart-js.ts` (can be `.js` if that's your jam!). Inside that folder, add the LLM chain which powers the magic.

Copy [this template](https://github.com/danieljpalmer/magic-chart-js/blob/main/src/chains/template.ts) and save!

Now deploy it:

```bash
relevance deploy
```

You're off to the races!

**TIP**: You can customise this chain as much as you like! For example, you might want to tweak the prompts or set it up to use different LLMs. However, our we expect it to always receive `results` and `prompt` as params, as well as return a `chartConfiguration` output variable. For more information, check out [Relevance AI docs](https://documentation.relevanceai.com).

## Using it

Start by creating a client, using your Relevance AI details:

```ts
import MagicChart from 'magic-chart-js';

const chart = new MagicChart({
    region: RELEVANCE_AI_REGION,
    project: RELEVANCE_AI_PROJECT,
});
```

Then call our `summonChart` method to render the chart.

```ts
chart.summonChart({
    item: document.getElementById('my-canvas'), // must be a canvas element
    results: [...], // an array of any data 
    prompt: 'Make it a pie chart please!', // optional
});
```

### item
This must be a `canvas` HTML element, where the chart will be rendered by `Chart.js`.

### results
This can be an array of any data. The LLM will decide how to display it!

**NOTE:** The more results you feed in, the larger your prompt sent to the LLM. This means more $$$ and also, the potential to break context limits. I recommend just sending a controlled amount, like 5-20 items at a time!


### prompt
Optionally, you can send in a request! You could even let your users do this!

## License

MIT &copy; [danieljpalmer](https://github.com/sponsors/danieljpalmer)
