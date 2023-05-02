function sortMsg(arr: Array<{ createAt: number }>) {
  arr.sort((a: { createAt: number }, b: { createAt: number }) => {
    return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
  });
}

export default sortMsg;
