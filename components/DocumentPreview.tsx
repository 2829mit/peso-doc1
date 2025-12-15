import React from 'react';
import { DocumentData, Vehicle } from '../types';

interface DocumentPreviewProps {
  data: DocumentData;
}

const FooterSignatory: React.FC<{ data: DocumentData }> = ({ data }) => (
  <div className="mt-12 flex flex-col items-start break-inside-avoid">
    <p className="font-bold mb-1">Authorized Signatory</p>
    <p>NAME: {data.authPersonName || "____________________"}</p>
    <p>DESIGNATION: {data.authPersonDesignation || "____________________"}</p>
    <div className="mt-4 border-t border-black w-48 pt-1">
      <p className="text-xs font-bold">STAMP & SIGNATURE</p>
    </div>
  </div>
);

const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white shadow-lg print:shadow-none print:w-full print:max-w-none max-w-[210mm] min-h-[297mm] mx-auto p-[20mm] mb-8 print:mb-0 relative font-serif-doc text-[11pt] leading-relaxed text-justify page-break ${className}`}>
    {children}
  </div>
);

const HeaderDate: React.FC<{ date: string; address?: string }> = ({ date, address }) => (
  <div className="flex justify-between items-start mb-8">
    <div className="whitespace-pre-wrap max-w-[60%]">
      {address ? address : "To,\n(Address of respective circle office)"}
    </div>
    <div className="text-right">
      Date: {date}
    </div>
  </div>
);

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ data }) => {
  
  return (
    <div className="print:w-full print:absolute print:top-0 print:left-0 print:z-50">
      
      {/* Page 1: Declaration of Authorized Signatory */}
      <PageWrapper>
        <HeaderDate date={data.date} address={data.circleOfficeAddress} />
        
        <div className="mb-6 font-bold underline">
          Sub: Declaration of Authorized signatory
        </div>

        <p className="mb-4">Dear Sir,</p>
        <p className="mb-8">
          We, hereby declare that Mr. <strong>{data.authPersonName}</strong> is authorized representative of M/S. <strong>{data.companyName}</strong> and have the authority to sign all necessary documents on behalf of the company as and when required.
        </p>

        <FooterSignatory data={data} />

        <div className="mt-12">
          <p className="font-bold mb-6">COMPANY PARTNERS / DIRECTORS: -</p>
          
          <div className="flex flex-col gap-12">
            <div className="flex items-end justify-between">
              <div>
                1) {data.authPersonName} ({data.authPersonDesignation})
              </div>
              <div className="border-t border-dashed border-black w-48 text-center text-xs">SIGN</div>
            </div>
             <div className="flex items-end justify-between">
              <div>
                2) {data.authPersonName} ({data.authPersonDesignation})
              </div>
              <div className="border-t border-dashed border-black w-48 text-center text-xs">SIGN</div>
            </div>
             <div className="flex items-end justify-between">
              <div>
                3) {data.authPersonName} ({data.authPersonDesignation})
              </div>
              <div className="border-t border-dashed border-black w-48 text-center text-xs">SIGN</div>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* Page 2: Undertaking by Legal Authority */}
      <PageWrapper>
        <div className="text-right mb-8">Date: - {data.date}</div>

        <div className="text-center font-bold mb-8">
          <p>Undertaking by Legal Authority</p>
          <p>(For Prior Approval for storage of Petroleum)</p>
        </div>

        <p className="mb-8">
          We/ I hereby confirm that the site where details are given below is under our/my legal/authorized possession and have clear right to use the same for storage of Petroleum and we/I further declare that no court case or other legal proceedings are under way in any Court of Law in respect of the said site/Land.
        </p>

        <div className="mb-8">
          <p className="font-bold underline mb-4">Details of the site: -</p>
          <table className="w-full">
            <tbody>
              <tr><td className="py-1 font-semibold w-40">KHASRA NO:-</td><td>{data.surveyNo}</td></tr>
              <tr><td className="py-1 font-semibold">Village :-</td><td>{data.villageName}</td></tr>
              <tr><td className="py-1 font-semibold">Taluka:-</td><td>{data.district}</td></tr>
              <tr><td className="py-1 font-semibold">STATE:-</td><td>{data.state}</td></tr>
              <tr><td className="py-1 font-semibold">PINCODE:-</td><td>{data.pinCode}</td></tr>
              <tr><td className="py-1 font-semibold">POLICE STATION:-</td><td>{data.policeStationName}</td></tr>
            </tbody>
          </table>
        </div>

        <p className="mb-8">Thanking You,</p>

        <FooterSignatory data={data} />
      </PageWrapper>

      {/* Page 3: Authorization Letter */}
      <PageWrapper>
        <HeaderDate date={data.date} address={data.circleOfficeAddress} />

        <div className="mb-6 font-bold underline">
          Sub: Authorization Letter
        </div>

        <p className="mb-4">Dear Sir,</p>
        <p className="mb-6">
          We hereby authorize Mr. Shailesh Khochare (Repos - Senior Associate Product Licensing) for Submit license document, technical discussion and signed of CCOE documentation from office on behalf of me.
        </p>
        
        <p className="mb-12">Specimen Signature,</p>

        <div className="mb-12">
          <p className="mb-2">( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</p>
          <p className="font-bold">Shailesh Khochare</p>
        </div>

        <p className="mb-2">Thanking you,</p>
        <p className="mb-8">Yours truly,</p>

        <FooterSignatory data={data} />
      </PageWrapper>

      {/* Page 4: Undertaking for No Schools... */}
      <PageWrapper>
        <HeaderDate date={data.date} address={data.circleOfficeAddress} />

        <div className="mb-6 font-bold text-justify">
          Subject: Undertaking for No Schools, Hospitals, or Residential Areas within 50 Meters of the Proposed aboveground Portable Fuel Station.
        </div>

        <p className="mb-4">Dear Sir,</p>
        
        <p className="mb-8">
          This is to certify that there are no schools, hospitals, or residential premises situated within a 50-meter radius from the boundary of the proposed aboveground Portable Station Services consumer pump facility with a 30KL tank.
        </p>

        <p className="mb-12">
          <strong>Site Address:</strong> {data.siteAddress}
        </p>

        <FooterSignatory data={data} />
      </PageWrapper>

      {/* Page 5: Request for issuing... */}
      <PageWrapper>
        <HeaderDate date={data.date} address={data.circleOfficeAddress} />

        <div className="mb-6 font-bold underline">
           Sub:- Request for issuing aboveground Portable Station Services consumer pump facility with 30KL tank. at {data.siteAddress}
        </div>

        <p className="mb-4">Dear Sir,</p>

        <p className="mb-4">
          M/S. <strong>{data.companyName}</strong> is proposed to install a Portable Service Station at {data.siteAddress}
        </p>

        <p className="mb-4">
          We are anticipating that we will need HSD in bulk to meet our captive requirement of Heavy Earth Moving Equipment and other mining Equipment. We wish to apply for prior approval for the installation of 30 KL Portable Service Station. Please find the attached documents in support of the application.
        </p>

        <p className="mb-2 font-bold">The list of uploaded documents are: -</p>
        <ol className="list-decimal pl-5 mb-8 space-y-1">
          <li>Form IX duly filled and signed.</li>
          <li>Online Payment Receipt</li>
          <li>Layout for the proposed 30KL Portable Service Station installation.</li>
          <li>List of Heavy Equipment and Vehicles with registration nos. tank capacity to be engaged in mining works and fueled from the Portable Service Station</li>
          <li>Undertaking towards lawful possession of land.</li>
          <li>Letter Authorized signatory.</li>
          <li>Confirmation from OMC/PMC for Supply letter (LOI)</li>
          <li>PAN, GST Certificate & Incorporation Certificate copy.</li>
          <li>Registered Land Agreement/7-12</li>
          <li>SOP Tank Operation & maintenance</li>
          <li>Portable Service station Tank Approved CCOE Letter & Drawing</li>
          <li>Undertaking of self-consumption letter</li>
        </ol>

        <p className="mb-4">
          We hereby affirm that the information stated above is true and correct to the best of our knowledge.
        </p>
        
        <p className="mb-8">Thanking You.</p>

        <FooterSignatory data={data} />
      </PageWrapper>

      {/* Page 6: List of vehicles */}
      <PageWrapper>
        <HeaderDate date={data.date} address={data.circleOfficeAddress} />

        <div className="mb-6 font-bold underline">
          Sub: - List of the vehicles in our possession for fueling from the Portable Service Station.
        </div>

        <p className="mb-4">Dear Sir,</p>

        <p className="mb-8">
          We are providing a list of the vehicles which are in our possession at our working site engaged in various {data.businessType} activity at {data.siteAddress}
        </p>

        <div className="mb-8">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-2 py-1">Sr. No.</th>
                <th className="border border-black px-2 py-1">Vehicle Number</th>
                <th className="border border-black px-2 py-1">Make</th>
                <th className="border border-black px-2 py-1">Model</th>
                <th className="border border-black px-2 py-1">Tank Capacity (LTR)</th>
              </tr>
            </thead>
            <tbody>
              {data.vehicles.map((v, idx) => (
                <tr key={v.id}>
                  <td className="border border-black px-2 py-1 text-center">{idx + 1}</td>
                  <td className="border border-black px-2 py-1 text-center">{v.vehicleNumber}</td>
                  <td className="border border-black px-2 py-1 text-center">{v.make}</td>
                  <td className="border border-black px-2 py-1 text-center">{v.model}</td>
                  <td className="border border-black px-2 py-1 text-center">{v.tankCapacity}</td>
                </tr>
              ))}
              {data.vehicles.length === 0 && (
                <tr>
                  <td colSpan={5} className="border border-black px-2 py-4 text-center text-gray-500">No vehicles listed</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <FooterSignatory data={data} />
      </PageWrapper>

      {/* Page 7: Issuance of NOC */}
      <PageWrapper>
        <HeaderDate date={data.date} address="To,\nThe Collector and district Magistrate" />

        <div className="mb-6 font-bold underline">
          SUB: Issuance of No Objection Certificate for Diesel dispensing storage facility
        </div>

        <p className="mb-4">Dear Sir,</p>

        <p className="mb-4">
          With reference to the subject mentioned above, we propose to establish a diesel dispensing facility at our M/S <strong>{data.companyName}</strong> mining site located at <strong>{data.siteAddress}</strong>. The diesel will be utilized for our own operations across various project activities. We have requested M/S. <strong>{data.omcName || "_________________"}</strong>. to supply diesel for this purpose. Additionally, we have already applied for prior approval from the Petroleum and Explosives Safety Organization (PESO), under the Ministry of Industry and Commerce, for the establishment of this facility
        </p>

        <p className="mb-4">
          In this regard, we kindly request your esteemed office to grant a No Objection Certificate (NOC) for the installation of a diesel storage and dispensing facility at the aforementioned site. For your reference, the following documents have been enclosed with this request letter:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Copies of drawings</li>
          <li>Copy of the letter submitted to OMC requesting the supply of diesel</li>
          <li>Copy of the Letter of Intent issued by OMC for diesel supply</li>
          <li>Land documents</li>
        </ul>

        <p className="mb-4">
          In view of the above, we hereby confirm that the facility will be operated only after obtaining the necessary license from the competent authorities authorized to issue the same.
        </p>

        <p className="mb-8">
          We appreciate your consideration and look forward to your approval
        </p>

        <p className="mb-8">Yours faithfully,</p>

        <FooterSignatory data={data} />
      </PageWrapper>

      {/* Page 8: SOP */}
      <PageWrapper>
         <div className="flex justify-between items-start mb-8">
            <div>Date: {data.date}</div>
            <div className="font-bold">SOP</div>
         </div>

         <div className="text-center font-bold mb-6">
            <p className="uppercase">TANK OPERATION AND MAINTENANCE SOP</p>
            <p className="uppercase mt-2">Decantation from tank truck and tank loading SOP</p>
         </div>

         <ol className="list-decimal pl-5 space-y-2 mb-8 text-sm">
            <li>Park the tank truck in the loading area in the drive out positon and secure the wheels with the help of wheel chock.</li>
            <li>Allow 10 minutes settings time</li>
            <li>Check the product level inside the portable service station using the dip stick</li>
            <li>Switch off the vehicle and master switch</li>
            <li>Check condition of the seal / security lock on the tank</li>
            <li>Keep the valid fire extinguisher ready in an easily accessible positon for emergency near vehicles.</li>
            <li>Connect the bonding reel clip</li>
            <li>Security connects the decantation hose with the loading points of the portable service station</li>
            <li>Check that the density @ 15 degree C using ASTM tables is within +/- 3.0 kg/M3 as compared with the challan density for ascertaining quality of product.</li>
            <li>Check weights & Measures markings on the dip rod at the bottom as well as at the proof level</li>
            <li>Check dips of the product in all compartments with the dip rod duly certified by weights & measurements department and provides with the POL tank. Also check for presence of water in each compartment by water finding paste. Before commencing POL tank decantation operation, the dispensing should be stopped till the completion of decantation.</li>
            <li>Release master valve levers to ensure product fills the pipelines.</li>
            <li>Start suction system of the product to initiate the filling of the portable service station tank.</li>
            <li>Stop suction system when the portable tank is completely filled</li>
            <li>After decanting the product ensure that the tank truck is fully emptied of the product before releasing the TT tank.</li>
            <li>Remove the decantation hose and keep the hose safety to it original positon</li>
            <li>Upon completion of the decantation check the level in the portable service station tank with the help of the dip stick</li>
            <li>Remove bounding reel clip and keep the extinguisher in its original positon.</li>
            <li>No dispensing / Fuelling opration are permitted during the decantation</li>
         </ol>

         <p className="mb-4">Thanking You.</p>

         <FooterSignatory data={data} />
      </PageWrapper>

       {/* Page 9: Proforma for NOC */}
       <PageWrapper>
        <p className="font-bold mb-4">Proforma for NOC by District Authority: ( Ref the Gazette Notification)</p>
        <div className="text-center font-bold mb-8">
          <p>Proforma</p>
          <p>No Objection Certificate</p>
          <p>[See rule 144]</p>
        </div>

        <div className="flex justify-between mb-4">
          <p>No…………….</p>
          <p>Date: {data.date}</p>
        </div>

        <p className="font-bold mb-4">Subject: No objection certificate</p>
        
        <p className="mb-4">
          With reference to the application No.……. dated …….. submitted by………….and in pursuance of rule 144 of the Petroleum Rules, 2002, there is no objection for granting licence under the Petroleum Rules, 2002 to <strong>M/S. {data.companyName}</strong> address <strong>{data.businessAddress || "(Business Address)"}</strong> for storage of petroleum products in their premises at <strong>{data.siteAddress}</strong> as shown in the site plan duly endorsed and enclosed herewith.
        </p>

        <p className="mb-2">(1) The following particulars have been considered while issuing this no objection certificate, that-</p>
        <div className="pl-4 space-y-1 mb-8">
          <p>(a) possession of the site by the applicant is lawful and authorisation from land owner or lease holder for developing premises under these rules for storage of petroleum products;</p>
          <p>(b) interest of public, specially the facilities like schools, hospitals or proximity to places of public assembly and the mitigating measures, if any, is provided;</p>
          <p>(c) traffic density and impact on traffic;</p>
          <p>(d) conformity of proposal to the local or area development planning;</p>
          <p>(e) accessibility of the site to fire tenders in case of emergency and preparedness of fire services for combating the emergencies;</p>
          <p>(f) genuineness of purpose.</p>
          <p>(g) any other matter pertinent to public safety;</p>
        </div>

        <div className="mt-16 text-right">
           <p className="w-1/2 ml-auto text-sm text-center">
             Signature of the district authority issuing no objection certificate with his office seal (in towns having a Commissioner of Police, the Commissioner or a Deputy Commissioner of Police and for any other place the District Magistrate)
           </p>
        </div>

        <p className="text-sm italic mt-8 border-t pt-2">
          Note.- The licensing authority shall accept the no objection certificate within a period of three years from the date of its issue for considering grant of licence.
        </p>

        <div className="mt-8">
           <p className="mb-4">Thanking You.</p>
           <FooterSignatory data={data} />
        </div>
       </PageWrapper>
    </div>
  );
};