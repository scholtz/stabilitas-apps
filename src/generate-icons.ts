import createIcon from "./stabilitas/createIcon";

const app = async () => {
  console.log(`${Date()} App started`);
  await createIcon();
};

app();
