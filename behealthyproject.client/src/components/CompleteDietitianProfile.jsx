import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from 'react-bootstrap/Dropdown';
import {
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap';
import { Snackbar, Alert } from '@mui/material';

function CompleteDietitianProfile() {
    const [specialization, setSpecialization] = useState(null);
    const [certifications, setCertifications] = useState([]);
    const [certificationInput, setCertificationInput] = useState('');
    const [experience, setExperience] = useState(null);
    const [price, setPrice] = useState(null);
    const [isComplete, setIsComplete] = useState();
    const [hasProgram, setHasProgram] = useState();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [uploadedPaths, setUploadedPaths] = useState([]);

    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();

    const specializationOptions = [
        "Clinical Nutrition", "Pediatric Nutrition", "Sports Nutrition", "Weight Management",
        "Public Health Nutrition", "Geriatric Nutrition", "Oncology Nutrition", "Diabetes Education",
        "Eating Disorders", "Food Service Management"
    ];

    const handleCertificationChange = (e) => {
        const input = e.target.value;
        if (input.includes(',')) {
            const newCerts = input
                .split(',')
                .map(c => c.trim())
                .filter(c => c.length > 0 && !certifications.includes(c));
            setCertifications([...certifications, ...newCerts]);
            setCertificationInput('');
        } else {
            setCertificationInput(input);
        }
    };

    const handleRemoveCertification = (certToRemove) => {
        setCertifications(certifications.filter(cert => cert !== certToRemove));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        const previews = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(previews).then(setPreviewImages);
    };

    const handleFileUpload = async () => {
        if (selectedFiles.length === 0) {
            setSnackbarMessage("Please choose files first.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        try {
            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append("files", file);
            });

            const res = await fetch("https://localhost:7148/api/Dietitian/upload-certificates", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                    // Content-Type əlavə etmə! FormData özü təyin edir
                },
                body: formData
            });

            let data = null;

            // JSON cavab varsa, oxuyuruq
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            }

            if (res.ok) {
                setSnackbarMessage("All certificates uploaded successfully!");
                setSnackbarSeverity("success");

                if (data?.paths) {
                    setUploadedPaths(data.paths);
                }
            } else {
                setSnackbarMessage(data?.message || "Upload failed.");
                setSnackbarSeverity("error");
            }

        } catch (err) {
            console.error("Upload error:", err);
            setSnackbarMessage("Upload failed.");
            setSnackbarSeverity("error");
        }

        setOpenSnackbar(true);
    };




    const handleSubmitProfile = async (ev) => {
        ev.preventDefault();

        const response = await fetch("https://localhost:7148/api/Dietitian/update-profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                specialization,
                certifications,
                experience,
                price
            })
        });

        if (response.ok) {
            const data = await response.json();
            setSnackbarMessage('Updated Profile!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            navigate("/pendingpage");
        } else {
            setSnackbarMessage('Update failed.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://localhost:7148/api/Dietitian/get-profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.status === 0 && data.isComplete) return navigate("/pendingpage");
                    if (data.status === 2) return navigate("/declinedpage");
                    if (data.status === 1 && data.isComplete) {
                        return navigate(data.hasProgram ? "/dietitianpage" : "/createprogram");
                    }

                    setSpecialization(data.specialization);
                    setExperience(data.experience);
                    setCertifications(Array.isArray(data.certifications)
                        ? data.certifications
                        : typeof data.certifications === 'string'
                            ? data.certifications.split(',').map(c => c.trim())
                            : []);
                    setIsComplete(data.isComplete);
                    setPrice(data.price);
                    setHasProgram(data.hasProgram);
                } else {
                    setSnackbarMessage('Invalid credentials.');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="signuppageimg">
            {!isComplete &&
                <div className="container d-flex justify-content-center align-items-center min-vh-100">
                    <div className="col-md-8 col-lg-6 p-4 shadow-lg rounded bg-light">
                        <h2 className="text-center mb-4">Complete Profile</h2>
                        <Form onSubmit={handleSubmitProfile}>
                            <FormGroup>
                                <Label for="certification">Certification(s)</Label>
                                <Input
                                    id="certification"
                                    name="certification"
                                    placeholder="e.g: Precision Nutrition, Dietitians of Canada"
                                    type="text"
                                    value={certificationInput}
                                    onChange={handleCertificationChange}
                                />
                                <div className="mt-2 d-flex flex-wrap gap-2">
                                    {certifications.map((certificate, id) => (
                                        <span key={id} className="badge bg-secondary text-black">
                                            {certificate} <span className="text-danger" style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={() => handleRemoveCertification(certificate)}>X</span>
                                        </span>
                                    ))}
                                </div>
                            </FormGroup>

                            <Dropdown className="mb-3">
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {specialization || "Select Specialization"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {specializationOptions.map((option, index) => (
                                        <Dropdown.Item key={index} onClick={() => setSpecialization(option)}>
                                            {option}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>

                            <FormGroup>
                                <Label htmlFor="experience">Experience (Years)</Label>
                                <Input
                                    id="experience"
                                    type="number"
                                    step="0.5"
                                    className="form-control"
                                    placeholder="3"
                                    max="75"
                                    min="1"
                                    onChange={(v) => {
                                        setExperience(Number(v.target.value));
                                    }}
                                    value={experience || ''}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="price">Price (USD)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.5"
                                    className="form-control"
                                    placeholder="19.99"
                                    max="100"
                                    min="1"
                                    onChange={(v) => {
                                        setPrice(Number(v.target.value));
                                    }}
                                    value={price || ''}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="certificateUpload">Upload Certificates</Label>
                                <Input
                                    type="file"
                                    id="certificateUpload"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    multiple
                                />
                                <div className="mt-3 d-flex flex-wrap gap-2">
                                    {previewImages.map((src, i) => (
                                        <img key={i} src={src} alt={`Preview ${i}`} className="img-thumbnail" style={{ maxHeight: "150px" }} />
                                    ))}
                                </div>
                                <Button
                                    type="button"
                                    color="primary"
                                    className="mt-2"
                                    onClick={handleFileUpload}
                                >
                                    Upload Certificates
                                </Button>
                            </FormGroup>

                            {uploadedPaths.length > 0 && (
                                <div className="mt-3">
                                    <strong>Uploaded Certificates:</strong>
                                    {uploadedPaths.map((path, i) => (
                                        <div key={i}>
                                            <img src={`https://localhost:7148${path}`} alt="Uploaded" className="img-fluid mt-2" style={{ maxHeight: '150px' }} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Button className="btn btn-success w-100 py-2" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            }

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        fontSize: '1.25rem',
                        padding: '16px',
                        textAlign: 'center',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default CompleteDietitianProfile;
