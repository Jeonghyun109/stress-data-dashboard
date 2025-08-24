import React, { useState } from "react";

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div>
      Welcome
    </div>
  );
}
export default Home;