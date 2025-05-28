import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Divider,
  IconButton,
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Define theme colors
const themeColors = {
  black: '#000000',
  cement: '#ccc5b9',
  lightCement: '#e6e2dd',
  darkCement: '#b8b2a7',
  white: '#ffffff',
  lightGray: '#f5f5f5',
  borderGray: '#cccccc'
};

// Custom styled components with black and cement theme
const FormContainer = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  border: `1px solid ${themeColors.borderGray}`,
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  maxWidth: '1200px',
  margin: '0 auto'
}));

const FormHeader = styled(Box)(({ theme }) => ({
  backgroundColor: themeColors.black,
  color: themeColors.white,
  padding: '12px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const FormContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: themeColors.white,
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: themeColors.darkCement,
      },
      '&.Mui-focused fieldset': {
        borderColor: themeColors.black,
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: themeColors.black,
    }
  },
  '& .MuiCheckbox-root': {
    color: themeColors.cement,
    '&.Mui-checked': {
      color: themeColors.black,
    }
  }
}));

const FormFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  backgroundColor: themeColors.cement,
  borderTop: `1px solid ${themeColors.darkCement}`,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2)
}));

const OperationHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  backgroundColor: themeColors.lightCement,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${themeColors.borderGray}`,
  borderRadius: '6px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: themeColors.cement,
  }
}));

const RequiredStar = styled('span')({
  color: 'red',
  marginLeft: '2px'
});

const ServiceForm = () => {
  const [formData, setFormData] = useState({
    serviceTypeName: '1st Free Service',
    isActive: false,
    isInstallation: false,
    isMandatory: false,
    isConsiderForDemand: false,
    isWarranty: false,
    isInsurance: false,
    serviceDueReading: '100',
    serviceDueDays: '365',
    operationDetailExpanded: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const toggleOperationDetail = () => {
    setFormData({
      ...formData,
      operationDetailExpanded: !formData.operationDetailExpanded
    });
  };

  const handleEdit = () => {
    console.log('Edit clicked', formData);
    // Implement edit functionality
  };

  const handleExit = () => {
    console.log('Exit clicked');
    // Implement exit functionality
  };

  return (
    <FormContainer>
      <FormHeader>
        <Typography variant="subtitle1">1st Free Service</Typography>
        <Box>
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#ccc5b9', // Cement color
              color: 'black',
              mr: 1,
              '&:hover': { bgcolor: '#b8b2a7' } // Darker cement on hover
            }}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#ccc5b9', // Cement color
              color: 'black',
              '&:hover': { bgcolor: '#b8b2a7' } // Darker cement on hover
            }}
            onClick={handleExit}
          >
            Exit
          </Button>
        </Box>
      </FormHeader>

      <FormContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label={
                <span>
                  Service Type Name
                  <RequiredStar>*</RequiredStar>
                </span>
              }
              name="serviceTypeName"
              value={formData.serviceTypeName}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  size="small"
                />
              }
              label="Is Active?"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isInstallation"
                  checked={formData.isInstallation}
                  onChange={handleCheckboxChange}
                  size="small"
                />
              }
              label="Is Installation?"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isMandatory"
                  checked={formData.isMandatory}
                  onChange={handleCheckboxChange}
                  size="small"
                />
              }
              label="Is Mandatory?"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isConsiderForDemand"
                  checked={formData.isConsiderForDemand}
                  onChange={handleCheckboxChange}
                  size="small"
                />
              }
              label="Is Consider For Demand?"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isWarranty"
                  checked={formData.isWarranty}
                  onChange={handleCheckboxChange}
                  size="small"
                />
              }
              label="Is Warranty?"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isInsurance"
                  checked={formData.isInsurance}
                  onChange={handleCheckboxChange}
                  size="small"
                />
              }
              label="Is Insurance?"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Service Due Reading"
              name="serviceDueReading"
              value={formData.serviceDueReading}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Service Due Days"
              name="serviceDueDays"
              value={formData.serviceDueDays}
              onChange={handleInputChange}
              fullWidth
              size="small"
              margin="dense"
            />
          </Grid>
        </Grid>

        {/* Operation Detail Section */}
        <Box sx={{ mt: 2 }}>
          <OperationHeader onClick={toggleOperationDetail}>
            {formData.operationDetailExpanded ?
              <ExpandMoreIcon fontSize="small" /> :
              <ChevronRightIcon fontSize="small" />
            }
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
              Operation Detail
            </Typography>
          </OperationHeader>
          <Collapse in={formData.operationDetailExpanded}>
            <Box sx={{ p: 2, border: '1px solid #ddd', borderTop: 0 }}>
              {/* Operation detail content would go here */}
              <Typography variant="body2">Operation detail content...</Typography>
            </Box>
          </Collapse>
        </Box>
      </FormContent>

      <FormFooter>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#000000', // Black button
            color: 'white',
            '&:hover': { bgcolor: '#333333' } // Lighter black on hover
          }}
          onClick={handleEdit}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#000000', // Black button
            color: 'white',
            '&:hover': { bgcolor: '#333333' } // Lighter black on hover
          }}
          onClick={handleExit}
        >
          Exit
        </Button>
      </FormFooter>
    </FormContainer>
  );
};

export default ServiceForm;
