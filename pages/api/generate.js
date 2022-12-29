import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = `
Create roasts for the person listed below based on their traits.
Person: 
Traits: 
`;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);
  console.log(process.env.OPENAI_API_KEY);
  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.9,
    max_tokens: 650,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();
  const secondPrompt = `
  Take the roasts made below and turn it into a poem in the style of Gordon Ramsay.

  Person: ${req.body.userInput}

  Roasts: ${basePromptOutput.text}

  Poem:
  `;

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
    // I also increase max_tokens.
    max_tokens: 1250,
  });
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
