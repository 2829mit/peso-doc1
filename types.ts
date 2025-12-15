export interface Vehicle {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
  tankCapacity: string;
}

export interface DocumentData {
  date: string;
  circleOfficeAddress: string;
  authPersonName: string;
  authPersonDesignation: string;
  companyName: string;
  siteAddress: string;
  surveyNo: string;
  villageName: string;
  district: string;
  state: string;
  pinCode: string;
  policeStationName: string;
  businessType: string;
  omcName: string; // Oil Marketing Company
  businessAddress: string;
  vehicles: Vehicle[];
}

const getFormattedDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const initialData: DocumentData = {
  date: getFormattedDate(),
  circleOfficeAddress: "To,\nThe Circle Head,\n[City Name]",
  authPersonName: "",
  authPersonDesignation: "",
  companyName: "",
  siteAddress: "",
  surveyNo: "",
  villageName: "",
  district: "",
  state: "",
  pinCode: "",
  policeStationName: "",
  businessType: "Mining/Construction",
  omcName: "",
  businessAddress: "",
  vehicles: [
    { id: '1', vehicleNumber: '', make: '', model: '', tankCapacity: '' }
  ]
};