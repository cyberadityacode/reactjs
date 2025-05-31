import { useEffect, useState } from "react";

const GitHubProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(
        "https://api.github.com/repos/cyberadityacode/reactjs",
        {
          headers: {
            Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
          },
        }
      );

      const data = await res.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;
  console.log("data of your profile:",profile);
  return (
    <div>
      {/* <h2>{profile.name}</h2>
      <p>{profile.bio}</p>
      <img src={profile.avatar_url} alt="avatar" width={100} /> */}
    </div>
  );
};

export default GitHubProfile;
