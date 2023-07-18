export interface IDetermineValue {
  downvotes: number;
  upvotes: number;
  newValue: number;
  oldValue: number;
}

export const determineVotes = (
  newValue: number,
  currentValue: number,
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
    if (currentValue === -1) values.downvotes = downvotes - 1;
    if (currentValue === 1) values.upvotes = upvotes - 1;
  } else if (values.newValue === 1) {
    if (currentValue === -1) values.downvotes = downvotes - 1;
    values.upvotes = upvotes + 1;
  } else if (values.newValue === -1) {
    if (currentValue === 1) values.upvotes = upvotes - 1;
    values.downvotes = downvotes + 1;
  }

  return values;
};
