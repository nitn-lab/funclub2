import React from 'react';

const tiers = [
    {
        title: 'Plus',
        description: ['Unlimited Likes', 'Unlimited Rewinds', '1 Free Boost a month', 'Hide Advertisements'],
        color: "text-[#ab4dd6]"
    },
    {
        title: 'Gold',
        description: ['See Who Likes You', 'Top Picks every day', 'Passport to any location', 'Weekly Super Likes', ],
        color: 'text-[#eec143]'
    },
    {
        title: 'Platinum',
        description: ['Message before matching', 'Priority likes', 'Boost your profile',],
        color: "text-[#d4d8dd]"
    },
];

const featureRows = [
    { feature: 'Match, Chat, Meet', plus: true, gold: true, platinum: true },
    { feature: 'Unlimited Likes', plus: true, gold: true, platinum: true },
    { feature: 'Unlimited Rewinds', plus: true, gold: true, platinum: true },
    { feature: 'Passport to any location', plus: true, gold: true, platinum: true },
    { feature: 'Hide Advertisements', plus: false, gold: true, platinum: true },
    { feature: 'Go Incognito', plus: false, gold: true, platinum: true },
    { feature: 'Super Likes', plus: false, gold: true, platinum: true },
    { feature: 'Free Boost', plus: false, gold: false, platinum: true },
    { feature: 'New Top Picks every day', plus: false, gold: false, platinum: true },
    { feature: 'Additional Feature 1', plus: false, gold: false, platinum: true },
    { feature: 'Additional Feature 2', plus: false, gold: false, platinum: true },
    { feature: 'Additional Feature 3', plus: false, gold:false, platinum: true },
];

const Subscription = () => {
    return (
        <div className="h-[100vh]  overflow-y-auto scrollable-div font-light bg-black text-white mx-auto w-full font-gotham pt-8 xs:pt-4"
        >
            <h2 className=" text-[#f0f2f4] text-3xl font-bold italic text-center" >Subscription Tiers</h2>
            <h3 className="text-[#c1c3c5] text-center mt-8 font-light xs:mt-4">Upgrade to Plus, Gold, or Platinum for an enhanced Tinder experience.</h3>
            {/* Cards - centered horizontally */}
            <div
            >
                <div className="flex justify-center gap-6  my-16 xs:my-8 mx-6 md:block md:mb-3">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className="bg-[#111418] rounded-lg py-4 px-8 h-64 md:h-auto hover:scale-110 border border-gray-600 transition-all w-72 md:w-3/4 md:mx-auto"
                        >
                            <h5 className={`text-2xl font-bold mb-2 ${tier.color}`}>{tier.title}</h5>
                            <ul >
                                {tier.description.map((line, index) => (
                                    <li key={index} className="text-[#ccd2d4] my-0.5">
                                        • {line}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Table - Not scrollable */}
            <div className="bg-[#111418] border-t-2 border-gray-600 pb-10 xs:pb-24">
                <h3 className="text-[#f0f2f4] text-2xl font-bold text-center mt-8 mb-16 xs:mb-8">Subscription Tier at a Glance</h3>
                <div className="flex justify-center">
                    <table className="w-[85%] md:w-98% border-collapse text-center">
                        <thead>
                            <tr className="bg-black font-semibold text-xl">
                                <th className="border border-gray-600 py-4">Features</th>
                                <th className="border border-gray-600">Plus</th>
                                <th className="border border-gray-600">Gold</th>
                                <th className="border border-gray-600">Platinum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {featureRows.map((row, index) => (
                                <tr key={index} className="py-4">
                                    <td className="border border-gray-600 py-4">{row.feature}</td>
                                    <td className="border border-gray-600 text-[#ab4dd6] w-[20%] text-3xl">
                                        {row.plus ? '•' : ''}
                                    </td>
                                    <td className="border border-gray-600 text-[#eec143] w-[20%] text-3xl">
                                        {row.gold ? '•' : ''}
                                    </td>
                                    <td className="border border-gray-600 text-[#d4d8dd] w-[20%] text-3xl">
                                        {row.platinum ? '•' : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Subscription;