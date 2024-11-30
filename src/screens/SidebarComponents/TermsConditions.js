import React from 'react';

const TermsAndConditions = () => {
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="mx-auto p-8 md:p-2 h-[100vh] md:h-[calc(100vh-110px)] bg-black scrollable-div overflow-y-auto text-white font-gotham font-light w-full xs:pb-32">
           <div className='bg-main-gradient py-24 xs:py-8 px-16 xs:px-4 mb-8'>
           <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
            <p>
                By using FunClub, you acknowledge that you have read and understand the information in this Policy.
            </p>
           </div>
            <div className="flex flex-col mb-8 items-start font-medium">
                <button
                    className="text-fuchsia-600 hover:text-fuchsia-800 mb-2"
                    onClick={() => scrollToSection('introduction')}
                >
                    1. Introduction
                </button>
                <button
                    className="text-fuchsia-600 hover:text-fuchsia-800 mb-2"
                    onClick={() => scrollToSection('personal-data')}
                >
                    2. What is Personal Data?
                </button>
                <button
                    className="text-fuchsia-600 hover:text-fuchsia-800 mb-2"
                    onClick={() => scrollToSection('changes')}
                >
                    3. Informing us of changes
                </button>
                <button
                    className="text-fuchsia-600 hover:text-fuchsia-800 mb-2"
                    onClick={() => scrollToSection('applicability')}
                >
                    4. Applicability of this Policy (18+)
                </button>
                <button
                    className="text-fuchsia-600 hover:text-fuchsia-800 mb-2"
                    onClick={() => scrollToSection('third-party-links')}
                >
                    5. Third-party links
                </button>
            </div>

            <div id="introduction" className="mb-4 ">
                <h2 className="text-2xl font-normal mb-2">Introduction</h2>
                <p className="text-sm  mb-4">
                    International Limited ("we", "us", "our") respects your privacy and we are committed to protecting the Personal Data we process about you. Fenix International Limited is the owner and operator of www.onlyfans.com ("OnlyFans"), a social network and content sharing platform which enables: (i) "Creators" to share and monetise their own content (as well as subscribe to, and view, the content of other Creators); and (ii) "Fans" to subscribe to, and view, the content of Creators.

                    This privacy policy ("Policy") explains our practices with respect to the Personal Data processed about our Creators and Fans. It also explains our practices with respect to the Personal Data processed about individuals that feature in content uploaded by a Creator ("Content Collaborators"), and where we process Personal Data in the context of our business relationships.

                    We process your Personal Data when you use OnlyFans and for the provision of the services that we offer from time to time via OnlyFans (the "Services"). We are a "data controller" of the Personal Data that we process in connection with the Services. This means that we decide the reasons why we process Personal Data about you and how we do so.

                    If you have any questions about this Policy or our processing of your Personal Data, please see Section 19 (assistance and contact information) for information about how to contact us.
                </p>
            </div>
            <div id="personal-data" className="mb-4 ">
                <h2 className="text-2xl font-normal mb-2">What is Personal Data?</h2>
                <p className="text-sm mb-4">
                    "Personal Data" means information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular person or household.

                    In addition, we may collect data that is not capable of identifying you or is otherwise not associated or linked with you, such as deidentified, aggregated or anonymised information. This type of data is not Personal Data and our use of such data is not subject to this Policy.
                </p>
            </div>
            <div id="changes" className="mb-4 ">
                <h2 className="text-2xl font-normal mb-2">Informing us of changes</h2>
                <p className="text-sm mb-4">
                We need to collect certain Personal Data from you to provide you with access to the Services, or specific features and functionalities of the Services, in accordance with our contract with you (i.e. our Terms of Service). We are also required to process certain Personal Data in accordance with applicable laws. Please note that if you do not wish to provide Personal Data where requested, we may not be able to provide you with access to the Services or specific features and functionalities of the Services.
                </p>
            </div>
            <div id="applicability" className="mb-4 ">
                <h2 className="text-2xl font-normal mb-2">Applicability of this Policy (18+)</h2>
                <p className="text-sm mb-4">
                    This policy applies to all users of OnlyFans who are 18 years of age or older.
                </p>
            </div>
            <div id="third-party-links" className="mb-4 ">
                <h2 className="text-2xl font-normal mb-2">Third-party links</h2>
                <p className="text-sm mb-4">
                    OnlyFans may contain links to third-party websites or services that are not affiliated with us. We are not responsible for the content or privacy practices of these websites or services.
                </p>
            </div>
        </div>
    );
};

export default TermsAndConditions;