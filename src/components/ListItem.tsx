import React, { useState } from "react";

type ListItemProps = {
  item: string;
};

const ListItem: React.FC<ListItemProps> = ({ item }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <input
        id={`${item}-id`}
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <label htmlFor={`${item}-id`}>{item}</label> 
    </div>
  );
};

export default ListItem;
