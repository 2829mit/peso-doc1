import React, { useState } from 'react';
import { DocumentData, initialData, Vehicle } from './types';
import { PESO_ADDRESSES, OMC_OPTIONS } from './constants';
import { DocumentPreview } from './components/DocumentPreview';
import { Input, TextArea, Select } from './components/Input';
import { FileText, Settings, Truck, MapPin, Building, Plus, Trash2, Download } from 'lucide-react';
import { generateDocument } from './utils/docxGenerator';

const App: React.FC = () => {
  const [data, setData] = useState<DocumentData>(initialData);
  const [activeTab, setActiveTab] = useState<'general' | 'site' | 'vehicles'>('general');
  const [selectedCircleKey, setSelectedCircleKey] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleCircleOfficeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedCircleKey(key);
    
    if (key && PESO_ADDRESSES[key]) {
      const address = PESO_ADDRESSES[key];
      // Construct the full address with "To," if not already handled
      setData(prev => ({ 
        ...prev, 
        circleOfficeAddress: `To,\n${address}` 
      }));
    } else if (key === "") {
        // Optional: clear or reset if needed, or leave as is
    }
  };

  const handleVehicleChange = (id: string, field: keyof Vehicle, value: string) => {
    setData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(v => v.id === id ? { ...v, [field]: value } : v)
    }));
  };

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      vehicleNumber: '',
      make: '',
      model: '',
      tankCapacity: ''
    };
    setData(prev => ({ ...prev, vehicles: [...prev.vehicles, newVehicle] }));
  };

  const removeVehicle = (id: string) => {
    setData(prev => ({ ...prev, vehicles: prev.vehicles.filter(v => v.id !== id) }));
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateDocument(data);
    } catch (error) {
      console.error("Failed to generate document:", error);
      alert("Failed to generate document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      
      {/* Sidebar - No Print */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col no-print z-10 shadow-xl">
        <div className="p-5 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 leading-tight">DocuGen Pro</h1>
            <p className="text-xs text-slate-500">Compliance Generator</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${activeTab === 'general' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Settings className="w-4 h-4" />
            General
          </button>
          <button 
            onClick={() => setActiveTab('site')}
            className={`flex-1 py-3 text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${activeTab === 'site' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <MapPin className="w-4 h-4" />
            Site & Loc
          </button>
          <button 
            onClick={() => setActiveTab('vehicles')}
            className={`flex-1 py-3 text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${activeTab === 'vehicles' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Truck className="w-4 h-4" />
            Vehicles
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-4">
                <Building className="w-4 h-4" /> Company Details
              </h3>
              <Input label="Company Name" name="companyName" value={data.companyName} onChange={handleChange} placeholder="e.g. Acme Mining Corp" />
              <TextArea label="Business Address" name="businessAddress" value={data.businessAddress} onChange={handleChange} placeholder="Full registered address" />
              <Input label="Business Type" name="businessType" value={data.businessType} onChange={handleChange} placeholder="e.g. Mining / Construction" />
              
              <div className="border-t border-slate-200 my-4 pt-4">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4" /> Authorized Person
                </h3>
                <Input label="Full Name" name="authPersonName" value={data.authPersonName} onChange={handleChange} placeholder="Mr. John Doe" />
                <Input label="Designation" name="authPersonDesignation" value={data.authPersonDesignation} onChange={handleChange} placeholder="Director / Partner" />
              </div>

              <div className="border-t border-slate-200 my-4 pt-4">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4" /> Doc Info
                </h3>
                <Input 
                  type="text" 
                  label="Date" 
                  name="date" 
                  value={data.date} 
                  onChange={handleChange} 
                  placeholder="DD/MM/YYYY"
                />
                
                <div className="mb-4">
                  <Select 
                    label="Circle Office Location" 
                    value={selectedCircleKey} 
                    onChange={handleCircleOfficeChange}
                    options={Object.keys(PESO_ADDRESSES).sort()} 
                  />
                  <TextArea 
                    label="Address (Generated)" 
                    name="circleOfficeAddress" 
                    value={data.circleOfficeAddress} 
                    onChange={handleChange} 
                    rows={4} 
                    className="mt-2 bg-slate-50"
                  />
                </div>

                <Select 
                  label="OMC Name" 
                  name="omcName" 
                  value={data.omcName} 
                  onChange={handleChange} 
                  options={OMC_OPTIONS} 
                />
              </div>
            </div>
          )}

          {activeTab === 'site' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" /> Location Details
              </h3>
              <TextArea label="Site Address (Full)" name="siteAddress" value={data.siteAddress} onChange={handleChange} rows={3} placeholder="Complete site address..." />
              
              <div className="grid grid-cols-2 gap-3">
                <Input label="Survey / Khasra No." name="surveyNo" value={data.surveyNo} onChange={handleChange} />
                <Input label="Village Name" name="villageName" value={data.villageName} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input label="Taluka/District" name="district" value={data.district} onChange={handleChange} />
                <Input label="State" name="state" value={data.state} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input label="Pin Code" name="pinCode" value={data.pinCode} onChange={handleChange} />
                <Input label="Police Station" name="policeStationName" value={data.policeStationName} onChange={handleChange} />
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="space-y-4 animate-fadeIn">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-sm text-slate-800">Fleet List</h3>
                 <button onClick={addVehicle} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-semibold hover:bg-blue-200 flex items-center gap-1">
                   <Plus className="w-3 h-3" /> Add
                 </button>
               </div>
               
               {data.vehicles.map((v, idx) => (
                 <div key={v.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 relative group">
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => removeVehicle(v.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                   <p className="text-xs font-bold text-slate-400 mb-2">Vehicle #{idx + 1}</p>
                   <div className="grid grid-cols-2 gap-2">
                     <Input label="Reg Number" value={v.vehicleNumber} onChange={(e) => handleVehicleChange(v.id, 'vehicleNumber', e.target.value)} className="!mb-0" />
                     <Input label="Capacity (Ltr)" value={v.tankCapacity} onChange={(e) => handleVehicleChange(v.id, 'tankCapacity', e.target.value)} className="!mb-0" />
                     <Input label="Make" value={v.make} onChange={(e) => handleVehicleChange(v.id, 'make', e.target.value)} className="!mb-0" />
                     <Input label="Model" value={v.model} onChange={(e) => handleVehicleChange(v.id, 'model', e.target.value)} className="!mb-0" />
                   </div>
                 </div>
               ))}
               
               {data.vehicles.length === 0 && (
                 <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                   No vehicles added yet.
                 </div>
               )}
            </div>
          )}

        </div>
        
        <div className="p-5 border-t border-slate-200 bg-slate-50">
          <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <Download className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Download DOCX'}
          </button>
        </div>
      </div>

      {/* Main Content - Preview */}
      <div className="flex-1 overflow-auto bg-slate-100 p-8 print:p-0 print:bg-white print:overflow-visible">
         <div className="max-w-[210mm] mx-auto no-print mb-4 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Document Preview</h2>
            <div className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
               {data.vehicles.length} Vehicles • A4 Format
            </div>
         </div>
         <DocumentPreview data={data} />
         <div className="h-20 no-print"></div> {/* Spacer */}
      </div>
    </div>
  );
};

export default App;