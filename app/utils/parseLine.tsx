export const parseLine = (line: string, reveal: boolean, guess?: string) => {
  const regex = /(\*.*?\*|\/.*?\/|[^*/]+)/g;
  const matches = line.match(regex);
  return matches?.map((segment, index) => {
    if (segment.startsWith('*')) {
      return <strong key={index}>{segment.slice(1, -1)}</strong>;
    }
    if (segment.startsWith('/')) {
      if (reveal) {
        return <strong className="underline" key={index}>{segment.slice(1, -1)}</strong>
      }
      else{
        return (
          <span key={index} className="underline">
            {guess || '____'}
          </span>
        );
      }
    }
    return segment;
  });
};