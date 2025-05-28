import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const OperationTable = () => {
  const { t } = useLanguage();
  
  // Mock data - in a real application, this would come from props or state
  const operations = [];
  
  return (
    <div>
      <div className="operation-detail">
        <span>{t.operationDetail}</span>
      </div>
      <table className="operation-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>{t.edit}</th>
            <th style={{ width: '80px' }}>{t.delete}</th>
            <th>
              {t.operationCode} <span className="required">*</span>
            </th>
            <th>{t.operationDescription}</th>
          </tr>
        </thead>
        <tbody>
          {operations.length > 0 ? (
            operations.map((operation) => (
              <tr key={operation.id}>
                <td>
                  <button className="button">{t.edit}</button>
                </td>
                <td>
                  <button className="button">{t.delete}</button>
                </td>
                <td>{operation.code}</td>
                <td>{operation.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-records">
                {t.noRecords}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OperationTable;
