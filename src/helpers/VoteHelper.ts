import { ILemmyVote } from "../types/lemmy/ILemmyVote";

export interface IDetermineValue {
  downvotes: number;
  upvotes: number;
  newValue: ILemmyVote;
  oldValue: ILemmyVote;
}

export const determineVotes = (
  newValue: ILemmyVote,
  currentValue: ILemmyVote,
  upvotes: number,
  downvotes: number
): IDetermineValue => {
  const values: IDetermineValue = {
    upvotes: 0,
    downvotes: 0,
    newValue,
    oldValue: currentValue,
  };

  // If we already voted, this will be a neutral vote.
  if (newValue === currentValue && newValue !== 0) values.newValue = 0;

  // Deal with updating the upvote/downvote count
  if (values.newValue === 0) {
    if (currentValue === -1) {
      values.downvotes = downvotes - 1;
      values.upvotes = upvotes;
    } else if (currentValue === 1) {
      values.upvotes = upvotes - 1;
      values.downvotes = downvotes;
    }
  } else if (values.newValue === 1) {
    if (currentValue === -1) values.downvotes = downvotes - 1;
    else values.downvotes = downvotes;
    values.upvotes = upvotes + 1;
  } else if (values.newValue === -1) {
    if (currentValue === 1) values.upvotes = upvotes - 1;
    else values.upvotes = upvotes;
    values.downvotes = downvotes + 1;
  }

  return values;
};
