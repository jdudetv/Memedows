import { useUserData } from "../../hooks";

const UserStats = () => {
  const userStats = useUserData();

  return (
    <>
      <span>Timeouts: {userStats.timeouts}</span>
      <span>Votes: {userStats.votes}</span>
      <span>Horny Jail: {userStats.jailVisits}</span>
    </>
  );
};

export default UserStats;
