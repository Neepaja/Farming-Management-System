import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addStatusApi } from '../../services/Api';
import './statusEnterPage.css';
import { Link } from 'react-router-dom';


function RibbonCountTable({ setRibbonCountData }) {
  const [ribbonCounts, setRibbonCounts] = useState([
    { color: '', count: '', action: '' },
  ]);
  const [colorOptions] = useState([
    'Blue',
    'Black',
    'Yellow',
    'Pink',
    'Red',
    'Orange',
    'Purple',
    'White',
  ]);

  const handleColorChange = (index, value) => {
    const updatedCounts = [...ribbonCounts];
    updatedCounts[index].color = value;
    setRibbonCounts(updatedCounts);
  };

  const handleCountChange = (index, value) => {
    const updatedCounts = [...ribbonCounts];
    updatedCounts[index].count = value;
    setRibbonCounts(updatedCounts);
  };

  const handleActionChange = (index, value) => {
    const updatedCounts = [...ribbonCounts];
    updatedCounts[index].action = value;
    setRibbonCounts(updatedCounts);
  };

  const handleAddRow = () => {
    if (ribbonCounts.length < 8) {
      setRibbonCounts([
        ...ribbonCounts,
        { color: '', count: '', action: '' },
      ]);
    }
  };

  const handleRemoveRow = (index) => {
    const updatedCounts = [...ribbonCounts];
    updatedCounts.splice(index, 1);
    setRibbonCounts(updatedCounts);
  };

  useEffect(() => {
    setRibbonCountData(
      ribbonCounts.filter((item) => item.color && item.count && item.action)
    );
  }, [ribbonCounts, setRibbonCountData]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Color</th>
            <th>Count</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ribbonCounts.map((item, index) => (
            <tr key={index}>
              <td>
                <select
                  value={item.color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                >
                  <option value="">Select Color</option>
                  {colorOptions.map((color, i) => (
                    <option key={i} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={item.count}
                  onChange={(e) => handleCountChange(index, e.target.value)}
                />
              </td>
              <td>
                <select
                  value={item.action}
                  onChange={(e) => handleActionChange(index, e.target.value)}
                >
                  <option value="">Select Action</option>
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                </select>
              </td>
              <td>
                {/* <button type="button" onClick={() => handleRemoveRow(index)}>Remove</button> */}
                <button type="button" class="remove" onClick={() => handleRemoveRow(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button type="button" onClick={handleAddRow}>Add Row</button> */}
      <button type="button" class="add-row" onClick={handleAddRow}>Add Row</button>
    </div>
  );
}

function StatusEntryPage() {
  const [farmerId, setFarmerId] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [AIRange, setAIRange] = useState('');
  const [farmers, setFarmers] = useState([]);
  const [date, setDate] = useState('');
  const [identifiedIssues, setIdentifiedIssues] = useState([]);
  const [neededResources, setNeededResources] = useState([]);
  const [ribbonCountData, setRibbonCountData] = useState([]); 
  const [inputActivity, setInputActivity] = useState('');
  const [inputUsedQuantity, setInputUsedQuantity] = useState('');
  const [inputUsedCost, setInputUsedCost] = useState('');
  const [machineryHours, setMachineryHours] = useState('');
  const [machineryCost, setMachineryCost] = useState('');
  const [labourHours, setLabourHours] = useState('');
  const [labourCost, setLabourCost] = useState('');
  const [soldAtEventsQuantity, setSoldAtEventsQuantity] = useState('');
  const [soldAtEventsIncome, setSoldAtEventsIncome] = useState('');
  const [destroyedQuantity, setDestroyedQuantity] = useState('');
  const [soldLocallyQuantity, setSoldLocallyQuantity] = useState('');
  const [soldLocallyIncome, setSoldLocallyIncome] = useState('');
  const [comments, setComments] = useState('');
  const [photos, setPhotos] = useState([]);
  const [products, setProducts] = useState([]);
  const [otherIssue, setOtherIssue] = useState('');
  const [showOtherIssueInput, setShowOtherIssueInput] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/items');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchFarmers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/farmerslist');
        console.log('Fetched farmers:', response.data); // Log fetched data
        setFarmers(response.data);
      } catch (error) {
        console.error('Error fetching farmers:', error);
      }
    };

    fetchProducts();
    fetchFarmers();
  }, []);

  useEffect(() => {
    console.log('Farmers state:', farmers); // Log farmers state
  }, [farmers]);

  const handleFarmerSelect = (event) => {
    const selectedFarmer = farmers.find(farmer => farmer.farmerID === parseInt(event.target.value));
    if (selectedFarmer) {
      setFarmerId(selectedFarmer.farmerID);
      setFarmerName(selectedFarmer.farmerName);
      setAIRange(selectedFarmer.AIRange);
    }
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newStatus = {
      farmerId,
      farmerName,
      AIRange,
      date,
      identifiedIssues: otherIssue
        ? [...identifiedIssues, otherIssue]
        : identifiedIssues,
      neededResources,
      ribbonCount: ribbonCountData,
      inputActivity,
      inputUsedQuantity,
      inputUsedCost,
      machineryHours,
      machineryCost,
      labourHours,
      labourCost,
      soldAtEventsQuantity,
      soldAtEventsIncome,
      destroyedQuantity,
      soldLocallyQuantity,
      soldLocallyIncome,
      comments,
      photos,
    };

    try {
      const data = await addStatusApi(newStatus);
      console.log(data);
    setSubmissionSuccess(true);
      setFarmerId('');
      setFarmerName('');
      setAIRange('');
      setDate('');
      setIdentifiedIssues([]);
      setNeededResources([]);
      setRibbonCountData([]); 
      setInputActivity('');
      setInputUsedQuantity('');
      setInputUsedCost('');
      setMachineryHours('');
      setMachineryCost('');
      setLabourHours('');
      setLabourCost('');
      setSoldAtEventsQuantity('');
      setSoldAtEventsIncome('');
      setDestroyedQuantity('');
      setSoldLocallyQuantity('');
      setSoldLocallyIncome('');
      setComments('');
      setPhotos([]);
      setOtherIssue('');
      setShowOtherIssueInput(false);
  //   } catch (error) {
  //     console.error('Error submitting form:', error);

  //   }
  // };
} catch (error) {
  console.error('Error submitting form:', error);
}
};

  return (
    <div className="status-entry-container">
      <h1 style={{ textAlign: "center", marginBottom: "35px", marginTop: "20px"}}>Status Entry</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-column">
            <label htmlFor="date">Date: </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-column">
            <label htmlFor="farmerName">Farmer Name:</label>
            <input
              type="text"
              id="farmerName"
              value={farmerName}
              readOnly
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-column">
            <label htmlFor="farmerId">Farmer:</label>
            <select
              id="farmerId"
              value={farmerId}
              onChange={handleFarmerSelect}
              required
            >
              <option value="" disabled>Select a farmer</option>
              {farmers.map(farmer => (
                <option key={farmer.farmerID} value={farmer.farmerID}>
                  {farmer.farmerID} - {farmer.farmerName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-column">
            <label htmlFor="AIRange">AI Range:</label>
            <input
              type="text"
              id="AIRange"
              value={AIRange}
              readOnly
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-column">
            <label htmlFor="identifiedIssues">Identified Issues:</label>
            <select
              id="identifiedIssues"
              value={identifiedIssues}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setIdentifiedIssues(
                  selectedOptions.filter((option) => option !== 'Other')
                );
                if (selectedOptions.includes('Other')) {
                  setOtherIssue('');
                  setShowOtherIssueInput(true);
                } else {
                  setShowOtherIssueInput(false);
                }
              }}
              multiple
            >
              <option value="Pest Issues">Pest Issues</option>
              <option value="Soil Quality">Soil Quality</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Wind Damage">Wind Damage</option>
              <option value="Black Dot End">Black Dot End</option>
              <option value="Other">Other</option>
            </select>
            {showOtherIssueInput && (
              <input
                type="text"
                id="otherIssue"
                value={otherIssue}
                onChange={(e) => setOtherIssue(e.target.value)}
                placeholder="Enter Other Issue"
              />
            )}
          </div>
          <div className="form-column">
            <label htmlFor="neededResources">Needed Resources:</label>
            <select
              id="neededResources"
              value={neededResources}
              onChange={(e) =>
                setNeededResources(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              multiple
              required
            >
              {products.map((product) => (
                <option key={product.itemId} value={product.itemId}>
                  {product.type}
                </option>
              ))}
            </select>
          </div>
        </div>
      <div className="form-row">
      <div className="form-column">
      <div className="IA-form-container">
      <div className="IA-form-column">
        <label htmlFor="ribbonCount">Ribbon Count:</label>
        <RibbonCountTable setRibbonCountData={setRibbonCountData} />
      </div>
      </div>
      </div>
      <div className="form-column">
        <div className="IA-form-container">
          <div className="IA-form-column">
          <h3 style={{ textAlign: "center" }}>Input Activities</h3>
            <div className="form-row">
            <div className="form-column">
              <label htmlFor="inputActivity">Activities:</label>
              <input type="text" id="inputActivity" value={inputActivity} onChange={(e) => setInputActivity(e.target.value)} placeholder="Activities" required style={{ width: "100%" }} />
            </div>
          </div>
            <h5>Input Used</h5>
            <div className="input-group">
              <div className="input-group-row">
                <label htmlFor="inputUsedQuantity">Quantity:</label>
                <input type="number" id="inputUsedQuantity" value={inputUsedQuantity} onChange={(e) => setInputUsedQuantity(e.target.value)} placeholder="Quantity" />
                <label htmlFor="inputUsedCost">Cost:</label>
                <input type="number" id="inputUsedCost" value={inputUsedCost} onChange={(e) => setInputUsedCost(e.target.value)} placeholder="Cost" />
              </div>
            </div>
            <h5>Machinery Used</h5>
            <div className="input-group">
            <div className="input-group-row">
              <label htmlFor="machineryHours">Hours:</label>
              <input type="number" id="machineryHours" value={machineryHours} onChange={(e) => setMachineryHours(e.target.value)} placeholder="Hours"/>
              <label htmlFor="machineryCost">Cost:</label>
              <input type="number" id="machineryCost" value={machineryCost} onChange={(e) => setMachineryCost(e.target.value)} placeholder="Cost" />
            </div>
            </div>
            <h5>Labour Used</h5>
            <div className="input-group">
            <div className="input-group-row">
              <label htmlFor="labourHours">Hours:</label>
              <input type="number" id="labourHours" value={labourHours} onChange={(e) => setLabourHours(e.target.value)} placeholder="Hours" />
              <label htmlFor="labourCost">Cost:</label>
              <input type="number" id="labourCost" value={labourCost} onChange={(e) => setLabourCost(e.target.value)} placeholder="Cost" />
            </div>
            </div>
            <h3 style={{ textAlign: "center", marginBottom: "35px", marginTop: "40px"}}>Cultivation Details</h3>
            <h5>Sold at Events</h5>
            <div className="input-group">
            <div className="input-group-row">
              <label htmlFor="soldAtEventsQuantity">Quantity:</label>
              <input type="number" id="soldAtEventsQuantity" value={soldAtEventsQuantity} onChange={(e) => setSoldAtEventsQuantity(e.target.value)} placeholder="Quantity"/>
              <label htmlFor="soldAtEventsIncome">Income:</label>
              <input type="number" id="soldAtEventsIncome" value={soldAtEventsIncome} onChange={(e) => setSoldAtEventsIncome(e.target.value)} placeholder="Income"/>
            </div>
            </div>
            <h5>Sold Locally</h5>
            <div className="input-group">
            <div className="input-group-row">
              <label htmlFor="soldLocallyQuantity">Quantity:</label>
              <input type="number" id="soldLocallyQuantity" value={soldLocallyQuantity} onChange={(e) => setSoldLocallyQuantity(e.target.value)} placeholder="Quantity" />
              <label htmlFor="soldLocallyIncome">Income:</label>
              <input type="number" id="soldLocallyIncome" value={soldLocallyIncome} onChange={(e) => setSoldLocallyIncome(e.target.value)} placeholder="Income" />
            </div>
            </div>
            <div className="form-row">
            <div className="form-column">
              <label htmlFor="destroyedQuantity">Destroyed Quantity:</label>
              <input type="number" id="destroyedQuantity" value={destroyedQuantity} onChange={(e) => setDestroyedQuantity(e.target.value)} placeholder="Quantity" />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div className="form-row">
      <div className="form-column">
        <label htmlFor="comments">Comments:</label>
        <textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)}></textarea>
      </div>
      <div className="form-column">
  <label htmlFor="photos">Photos:</label>
  <label htmlFor="photos" className="custom-file-upload">
    Choose Files
  </label>
  <input type="file" id="photos" multiple onChange={(e) => setPhotos(e.target.files)} />
</div>
    </div>
        <div className="button-container">
          <button type="submit">Submit</button>
        </div>
        <Link to="/dashboard" className="btn btn-secondary">Go Back</Link>
      </form>
      {submissionSuccess && (
  <>
    <div className="modal-overlay"></div>
    <div className="success-modal">
      <p>Submission successful!</p>
      <button onClick={() => setSubmissionSuccess(false)}>Close</button>
    </div>
  </>
)}

    </div>
  );
  
};  

export default StatusEntryPage;
