import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import FamilyProductsCatalog from '../components/family/FamilyProductsCatalog';
import { normalizeFamilyRecipient } from '../utils/familyNavigation';

const recipientLabels = {
    all: 'Family Collections',
    mother: 'Mother Collections',
    father: 'Father Collections',
    brother: 'Brother Collections',
    sister: 'Sister Collections',
    husband: 'Husband Collections',
    wife: 'Wife Collections'
};

const FamilyRecipientProductsPage = () => {
    const { recipient } = useParams();
    const selectedRecipient = normalizeFamilyRecipient(recipient);

    useEffect(() => {
        document.title = `${recipientLabels[selectedRecipient] || 'Family Collections'} | Sands Ornaments`;
        window.scrollTo(0, 0);
    }, [selectedRecipient]);

    return (
        <div className="bg-white min-h-screen text-black font-sans overflow-x-hidden">
            <div className="border-b border-[#f3d8df] bg-[#fff9fb]">
                <div className="container mx-auto px-4 md:px-8 py-4 md:py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8E2B45]">
                            Gifts for Family
                        </p>
                        <h1 className="mt-1 font-serif text-2xl md:text-4xl text-[#2D060F]">
                            {recipientLabels[selectedRecipient] || 'Family Collections'}
                        </h1>
                    </div>

                    <Link
                        to="/category/family"
                        className="inline-flex items-center justify-center rounded-full border border-[#8E2B45]/20 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8E2B45] transition-colors hover:bg-[#fff0f4]"
                    >
                        Back to Family
                    </Link>
                </div>
            </div>

            <FamilyProductsCatalog selectedRecipient={selectedRecipient} />
        </div>
    );
};

export default FamilyRecipientProductsPage;
