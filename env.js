import fs from 'fs';

export const env = () => {
  try {
    const data = fs.readFileSync('./env.json', 'utf8');
    const variables = JSON.parse(data);
    const keys = Object.keys(variables);
    keys.forEach((key) => {
      process.env[key] = variables[key];
    });
  } catch (error) {
    console.error('err', error.message);
  }
};
