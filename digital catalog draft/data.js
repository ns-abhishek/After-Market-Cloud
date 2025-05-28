// Catalog Data Structure
const catalogData = {
    categories: [
        {
            id: "oidl",
            name: "OIDL-CBB-36",
            type: "folder",
            items: [
                {
                    id: "bus-service",
                    name: "Bus service manual",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Comprehensive service manual for bus maintenance and repair procedures.",
                    specs: {
                        "Document Type": "Service Manual",
                        "Format": "PDF",
                        "Pages": "120",
                        "Last Updated": "2023-05-15"
                    }
                },
                {
                    id: "srt-cv",
                    name: "SRT-CV-StandardRepairTime",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Standard repair time guidelines for CV models.",
                    specs: {
                        "Document Type": "Reference Guide",
                        "Format": "PDF",
                        "Pages": "45",
                        "Last Updated": "2023-06-20"
                    }
                },
                {
                    id: "wpp-cv",
                    name: "WPP-CV-BusWarrantyPolicy",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Warranty policy documentation for CV bus models.",
                    specs: {
                        "Document Type": "Policy Document",
                        "Format": "PDF",
                        "Pages": "32",
                        "Last Updated": "2023-04-10"
                    }
                },
                {
                    id: "bus-workshop",
                    name: "Bus Workshop-Manual",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Workshop manual with detailed repair and maintenance procedures for buses.",
                    specs: {
                        "Document Type": "Workshop Manual",
                        "Format": "PDF",
                        "Pages": "215",
                        "Last Updated": "2023-03-05"
                    }
                },
                {
                    id: "bs-cv",
                    name: "BS-CV-TechnicalServiceBulletin",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Technical service bulletins for CV models.",
                    specs: {
                        "Document Type": "Service Bulletin",
                        "Format": "PDF",
                        "Pages": "28",
                        "Last Updated": "2023-07-12"
                    }
                },
                {
                    id: "ed-cv",
                    name: "ED-CV-ElectricalDiagrams",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Electrical diagrams and schematics for CV models.",
                    specs: {
                        "Document Type": "Technical Diagrams",
                        "Format": "PDF",
                        "Pages": "75",
                        "Last Updated": "2023-02-18"
                    }
                },
                {
                    id: "ttp-cv",
                    name: "TTP-CV-PDI-Checklist",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Pre-delivery inspection checklist for CV models.",
                    specs: {
                        "Document Type": "Checklist",
                        "Format": "PDF",
                        "Pages": "12",
                        "Last Updated": "2023-08-01"
                    }
                },
                {
                    id: "cr-cv",
                    name: "CR-CV-SafetyRecall",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Safety recall information and procedures for CV models.",
                    specs: {
                        "Document Type": "Recall Notice",
                        "Format": "PDF",
                        "Pages": "18",
                        "Last Updated": "2023-09-05"
                    }
                },
                {
                    id: "pd-cv",
                    name: "PD-CV-PneumaticDiagrams",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Pneumatic system diagrams for CV models.",
                    specs: {
                        "Document Type": "Technical Diagrams",
                        "Format": "PDF",
                        "Pages": "42",
                        "Last Updated": "2023-01-25"
                    }
                },
                {
                    id: "sh-cv",
                    name: "SH-CV-ServiceManual",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Service manual for CV models.",
                    specs: {
                        "Document Type": "Service Manual",
                        "Format": "PDF",
                        "Pages": "180",
                        "Last Updated": "2023-04-30"
                    }
                },
                {
                    id: "oh-cv",
                    name: "OH-CV-OperatorManual",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Operator manual for CV models.",
                    specs: {
                        "Document Type": "Operator Manual",
                        "Format": "PDF",
                        "Pages": "65",
                        "Last Updated": "2023-05-22"
                    }
                }
            ]
        },
        {
            id: "doors",
            name: "DOORS & LIDS - 2615/2520/1805/847",
            type: "folder",
            items: [
                {
                    id: "cbdtool",
                    name: "CBDTOOL TOOL SET 2190/2115/1510/707",
                    type: "part",
                    description: "Tool set for door and lid maintenance and repair.",
                    specs: {
                        "Part Number": "CBDTOOL",
                        "Compatible Models": "Multiple",
                        "Weight": "3.2 kg",
                        "Dimensions": "45 x 30 x 15 cm"
                    }
                },
                {
                    id: "cbdlfdoor",
                    name: "CBDLFDOOR FRONT DOOR ASSEMBLY 2206/2130/1510",
                    type: "part",
                    description: "Front door assembly for commercial vehicles.",
                    specs: {
                        "Part Number": "CBDLFDOOR",
                        "Compatible Models": "CV Series 2000-2023",
                        "Weight": "28.5 kg",
                        "Material": "Steel/Aluminum Composite",
                        "Dimensions": "210 x 130 x 15 cm"
                    }
                },
                {
                    id: "cbdlrlid-1",
                    name: "CBDLRLID-1 REAR LID 2528/2438/1745/818",
                    type: "part",
                    description: "Rear lid assembly type 1 for commercial vehicles.",
                    specs: {
                        "Part Number": "CBDLRLID-1",
                        "Compatible Models": "CV Series 2018-2023",
                        "Weight": "18.2 kg",
                        "Material": "Reinforced Composite",
                        "Dimensions": "252.8 x 243.8 x 17.45 cm"
                    }
                },
                {
                    id: "cbdlrlid-2",
                    name: "CBDLRLID-2 REAR LID 2529/2438/1746/818",
                    type: "part",
                    description: "Rear lid assembly type 2 for commercial vehicles.",
                    specs: {
                        "Part Number": "CBDLRLID-2",
                        "Compatible Models": "CV Series 2020-2023",
                        "Weight": "19.5 kg",
                        "Material": "Reinforced Composite with Steel Frame",
                        "Dimensions": "252.9 x 243.8 x 17.46 cm"
                    }
                }
            ]
        },
        {
            id: "interior",
            name: "INTERIOR TRIMMING BLUE - 2615/2521/1896/847",
            type: "folder",
            items: [
                {
                    id: "cbittool",
                    name: "CBITTOOL TOOL SET 2243/2165/1547/724",
                    type: "part",
                    description: "Tool set for interior trimming installation and maintenance.",
                    specs: {
                        "Part Number": "CBITTOOL",
                        "Compatible Models": "Multiple",
                        "Weight": "2.8 kg",
                        "Dimensions": "40 x 25 x 12 cm"
                    }
                },
                {
                    id: "cbitsvv",
                    name: "CBITSV SUN VISOR 2232/2155/1539/721",
                    type: "part",
                    description: "Sun visor with blue trimming for commercial vehicles.",
                    specs: {
                        "Part Number": "CBITSVV",
                        "Compatible Models": "CV Series 2019-2023",
                        "Color": "Blue",
                        "Material": "UV-Resistant Composite",
                        "Dimensions": "223.2 x 215.5 x 15.39 cm"
                    }
                },
                {
                    id: "cbitfhl",
                    name: "CBITFHL FRONT HEADLINER 2235/2158/1541/722",
                    type: "part",
                    description: "Front headliner with blue trimming for commercial vehicles.",
                    specs: {
                        "Part Number": "CBITFHL",
                        "Compatible Models": "CV Series 2019-2023",
                        "Color": "Blue",
                        "Material": "Acoustic Dampening Fabric",
                        "Dimensions": "223.5 x 215.8 x 15.41 cm"
                    }
                },
                {
                    id: "cbitrlr",
                    name: "CBITRLR REAR HEADLINER 2237/2159/1542/722",
                    type: "part",
                    description: "Rear headliner with blue trimming for commercial vehicles.",
                    specs: {
                        "Part Number": "CBITRLR",
                        "Compatible Models": "CV Series 2019-2023",
                        "Color": "Blue",
                        "Material": "Acoustic Dampening Fabric",
                        "Dimensions": "223.7 x 215.9 x 15.42 cm"
                    }
                },
                {
                    id: "cbitrh",
                    name: "CBITRH HANDLE 2240/2162/1545/723",
                    type: "part",
                    description: "Interior handle with blue trimming for commercial vehicles.",
                    specs: {
                        "Part Number": "CBITRH",
                        "Compatible Models": "CV Series 2019-2023",
                        "Color": "Blue/Chrome",
                        "Material": "ABS Plastic with Chrome Finish",
                        "Dimensions": "22.4 x 21.62 x 15.45 cm"
                    }
                }
            ]
        },
        {
            id: "software",
            name: "SOFTWARE UPDATES EN - 2625/2539/1815/851",
            type: "folder",
            items: [
                {
                    id: "ensu1",
                    name: "ENSU 1 (2020-2021) 2630/2535/1816/852",
                    type: "software",
                    description: "Software update package for 2020-2021 models.",
                    specs: {
                        "Version": "1.5.8",
                        "Compatible Models": "2020-2021 CV Series",
                        "Release Date": "2022-03-15",
                        "File Size": "1.2 GB",
                        "Installation Time": "Approximately 45 minutes"
                    }
                },
                {
                    id: "ensu2",
                    name: "ENSU 2 (2021-2022) 2631/2536/1817/852",
                    type: "software",
                    description: "Software update package for 2021-2022 models.",
                    specs: {
                        "Version": "2.1.3",
                        "Compatible Models": "2021-2022 CV Series",
                        "Release Date": "2022-09-20",
                        "File Size": "1.5 GB",
                        "Installation Time": "Approximately 50 minutes"
                    }
                },
                {
                    id: "ensu3",
                    name: "ENSU 3 (2022-2023) 2631/2536/1817/852",
                    type: "software",
                    description: "Software update package for 2022-2023 models.",
                    specs: {
                        "Version": "3.0.2",
                        "Compatible Models": "2022-2023 CV Series",
                        "Release Date": "2023-04-10",
                        "File Size": "1.8 GB",
                        "Installation Time": "Approximately 55 minutes"
                    }
                },
                {
                    id: "ensu4",
                    name: "ENSU 4 (2023-2024) 2632/2537/1818/852",
                    type: "software",
                    description: "Software update package for 2023-2024 models.",
                    specs: {
                        "Version": "4.0.1",
                        "Compatible Models": "2023-2024 CV Series",
                        "Release Date": "2023-10-05",
                        "File Size": "2.1 GB",
                        "Installation Time": "Approximately 60 minutes"
                    }
                }
            ]
        },
        {
            id: "engine",
            name: "ENGINE - 2608/2514/1801/845",
            type: "folder",
            items: [
                {
                    id: "operator-manual",
                    name: "Operator Manual-Engine",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Operator manual for engine operation and basic maintenance.",
                    specs: {
                        "Document Type": "Operator Manual",
                        "Format": "PDF",
                        "Pages": "85",
                        "Last Updated": "2023-06-15"
                    }
                },
                {
                    id: "standard-repair",
                    name: "Standard Repair Time",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Standard repair time guidelines for engine maintenance and repairs.",
                    specs: {
                        "Document Type": "Reference Guide",
                        "Format": "PDF",
                        "Pages": "42",
                        "Last Updated": "2023-07-20"
                    }
                },
                {
                    id: "egsassy00a1",
                    name: "EGSASSY00A1 ENGINE AND GENERATOR TO SKID ASSEMBLY 2068/2514/1801/845",
                    type: "part",
                    description: "Complete engine and generator assembly mounted on skid.",
                    specs: {
                        "Part Number": "EGSASSY00A1",
                        "Engine Type": "Diesel",
                        "Power Output": "320 HP",
                        "Weight": "685 kg",
                        "Dimensions": "206.8 x 251.4 x 180.1 cm"
                    }
                },
                {
                    id: "eglassy00a1",
                    name: "EGLASSY00A1 ENGINE ASSEMBLY - LEFT SIDE 2067/2514/1801/845",
                    type: "part",
                    description: "Left side engine assembly component.",
                    specs: {
                        "Part Number": "EGLASSY00A1",
                        "Compatible Models": "CV Series 2020-2023",
                        "Weight": "210 kg",
                        "Material": "Cast Iron/Aluminum",
                        "Dimensions": "206.7 x 251.4 x 180.1 cm"
                    }
                },
                {
                    id: "ersassy00a1",
                    name: "ERSASSY00A1 ENGINE ASSEMBLY - RIGHT SIDE 2068/2514/1801/845",
                    type: "part",
                    description: "Right side engine assembly component.",
                    specs: {
                        "Part Number": "ERSASSY00A1",
                        "Compatible Models": "CV Series 2020-2023",
                        "Weight": "215 kg",
                        "Material": "Cast Iron/Aluminum",
                        "Dimensions": "206.8 x 251.4 x 180.1 cm"
                    }
                },
                {
                    id: "ehtassy00a1",
                    name: "EGSASSY00A1 HOTSTART ASSEMBLY TOTOTH 2070/2514/1801/845",
                    type: "part",
                    description: "Engine hot start assembly component.",
                    specs: {
                        "Part Number": "EHTASSY00A1",
                        "Compatible Models": "CV Series 2020-2023",
                        "Weight": "28 kg",
                        "Operating Temperature": "-40°C to 85°C",
                        "Dimensions": "45 x 32 x 25 cm"
                    }
                },
                {
                    id: "emassy00a1",
                    name: "EMASSY00A1 ENGINE MOUNT ASSEMBLY 2092/2020/1801/845",
                    type: "part",
                    description: "Engine mounting assembly for secure installation.",
                    specs: {
                        "Part Number": "EMASSY00A1",
                        "Compatible Models": "CV Series 2020-2023",
                        "Weight": "42 kg",
                        "Material": "High-Strength Steel",
                        "Dimensions": "209.2 x 202.0 x 180.1 cm"
                    }
                },
                {
                    id: "udcb00a1",
                    name: "UDCB00A1 UNIT DECALS - CONTROL BOX 2093/2021/1801/845",
                    type: "part",
                    description: "Decal set for engine control box.",
                    specs: {
                        "Part Number": "UDCB00A1",
                        "Compatible Models": "CV Series 2020-2023",
                        "Material": "Weather-Resistant Vinyl",
                        "Dimensions": "Various Sizes"
                    }
                }
            ]
        },
        {
            id: "software-updates",
            name: "SOFTWARE UPDATES EN - 2625/2539/1816/851",
            type: "folder",
            items: [
                {
                    id: "software-update-1",
                    name: "SOFTWARE UPDATE PACKAGE 2625/2539/1816/851",
                    type: "software",
                    description: "Comprehensive software update package for all systems.",
                    specs: {
                        "Version": "5.2.1",
                        "Compatible Models": "All CV Series",
                        "Release Date": "2023-11-15",
                        "File Size": "3.5 GB",
                        "Installation Time": "Approximately 90 minutes"
                    }
                }
            ]
        },
        {
            id: "gearbox",
            name: "GEARBOX_GB01 - 2609/2515/1802/845",
            type: "folder",
            items: [
                {
                    id: "technical-service",
                    name: "Technical Service Bulletin",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Technical service bulletins for gearbox maintenance and troubleshooting.",
                    specs: {
                        "Document Type": "Service Bulletin",
                        "Format": "PDF",
                        "Pages": "35",
                        "Last Updated": "2023-08-10"
                    }
                },
                {
                    id: "safety-recall",
                    name: "Safety Recall",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Safety recall information for specific gearbox models.",
                    specs: {
                        "Document Type": "Recall Notice",
                        "Format": "PDF",
                        "Pages": "22",
                        "Last Updated": "2023-09-18"
                    }
                },
                {
                    id: "transmission-operator",
                    name: "Transmission-Operator Manual",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Operator manual for transmission operation and basic maintenance.",
                    specs: {
                        "Document Type": "Operator Manual",
                        "Format": "PDF",
                        "Pages": "58",
                        "Last Updated": "2023-07-25"
                    }
                },
                {
                    id: "transmission-service",
                    name: "Transmission-Service Manual",
                    type: "file",
                    icon: "fa-file-alt",
                    description: "Service manual for transmission maintenance and repairs.",
                    specs: {
                        "Document Type": "Service Manual",
                        "Format": "PDF",
                        "Pages": "120",
                        "Last Updated": "2023-06-30"
                    }
                }
            ]
        }
    ]
};
