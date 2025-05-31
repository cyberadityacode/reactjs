import axios from "axios";

export const fetchGitTree = async (para) => {
  try {
    const res = await axios.get(
      para,
      {
        headers: {
          Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json", // Optional but recommended
        },
      }
    );

    console.log("list tree -", res.data.tree); // Axios puts data in `res.data`
    return res.data.tree;
  } catch (err) {
    console.error("GitHub API request failed", err);
  }
};
