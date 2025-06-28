import User from "../models/user.js";
import Submission from "../models/submission.js";

export const updateUserStats = async (userId, problemId, isAccepted) => {
  const user = await User.findById(userId);
  if (!user) return;

  user.totalSubmissions += 1;
  if (isAccepted) {
    user.acceptedSubmissions += 1;

    const alreadySolved = await Submission.exists({
      user: userId,
      problem: problemId,
      isAccepted: true,
    });

    if (!alreadySolved) {
      user.problemsSolved += 1;
    }
  }

  await user.save();
};
