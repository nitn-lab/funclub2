import React from 'react';

const UserInfo = React.memo(({ username, profileImage }) => {
  return (
    <div className="font-gotham font-light flex items-center gap-x-3 bg-main-gradient px-3 py-2 rounded-sm">
    <img
        src={profileImage}
        alt="Profile"
        className="w-10 h-10 object-cover rounded-full"
      />
      <div className=" text-white text-lg">
        <p className="truncate">{username}</p>
      </div>
      
    </div>
  );
});

export default UserInfo;