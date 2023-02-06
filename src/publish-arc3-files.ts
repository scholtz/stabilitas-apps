import createArc3Files from "./stabilitas/createArc3Files";

const app = async () => {
  console.log(`${Date()} App started`);
  await createArc3Files();
};

app();
