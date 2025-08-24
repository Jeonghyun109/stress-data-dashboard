const TreeMapInfo: React.FC<{ pid: string, type: 'psychological' | 'physiological' }> = ({ pid, type }) => {
  console.log(pid, type);

  switch (pid) {
    case '1':
      return <>1</>
    case '2':
      return <>2</>
    case '3':
      return <>3</>
    default:
      return <>4</>
  }
};

export default TreeMapInfo;