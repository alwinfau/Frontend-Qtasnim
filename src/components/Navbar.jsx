// eslint-disable-next-line no-unused-vars
import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-gray-50 p-4 text-emerald-500 sm:ml-64 sticky top-0 z-50">
            <div className="flex items-center justify-between">
                <input type="text" className="block  border-0 py-2 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-emerald-200 sm:text-sm sm:leading-6" placeholder="search.." />
                <img src="https://i.pravatar.cc/150" alt="profile-imges" className="rounded-full w-10" />
            </div>
        </nav>
    );
};

export default Navbar;
