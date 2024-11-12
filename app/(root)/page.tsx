import React from 'react'
import CompanyProfileBox from '@/components/ui/CompanyProfileBox'

import bonefishing_1 from '/public/companyExamples/Andros-1.jpg';
import bonefishing_2 from '/public/companyExamples/Andros-2.jpg';
import bonefishing_3 from '/public/companyExamples/Andros-3.jpg';
import bonefishing_4 from '/public/companyExamples/Andros-4.jpg';
import bonefishing_5 from '/public/companyExamples/Andros-5.jpg';
import bonefishing_6 from '/public/companyExamples/Andros-6.jpg';
import bonefishing_7 from '/public/companyExamples/Andros-7.jpg';

const Home = () => {
  return (
    <section className="home">
        <div className="home-companies">
          <CompanyProfileBox
          category="Fishing"
          businessProduct="Fishing Day Trips"
          businessName="Melly's Adventures"
          available="available"
          image={bonefishing_1.src}
          />
          <CompanyProfileBox
          category="Fishing"
          businessProduct="Fishing Day Trips"
          businessName="Ocean Tours"
          available="available"
          image={bonefishing_2.src}
          />
          <CompanyProfileBox
          category="Fishing"
          businessProduct="Fishing Day Trips"
          businessName="Ocean Odyssey"
          available="sold out"
          image={bonefishing_3.src}
          />
          <CompanyProfileBox
          category="Fishing"
          businessProduct="Fishing Day Trips"
          businessName="Bonefish Bonanza"
          available="sold out"
          image={bonefishing_4.src}
          />
          <CompanyProfileBox
          category="Fishing"
          businessProduct="Fishing Day Trips"
          businessName="Andros Excursions"
          available="available"
          image={bonefishing_5.src}
          />
          <CompanyProfileBox
          category="Fishing"
          businessProduct="Fishing Day Trips"
          businessName="Bait & Tackle Tours"
          available="available"
          image={bonefishing_6.src}
          />
          <CompanyProfileBox
          category="Fishing"
          businessProduct="Fishing Day Trips"
          businessName="Waterway Wonders Fishing"
          available="available"
          image={bonefishing_7.src}
          />
        </div>
      </section>
  )
}

export default Home