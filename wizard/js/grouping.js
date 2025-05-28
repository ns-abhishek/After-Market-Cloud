/**
 * Report Wizard - Grouping Module
 *
 * This module handles grouping and aggregation functionality.
 */

// Format a field name into a readable label
function formatFieldLabel(fieldName) {
    if (!fieldName) return '';

    // Replace underscores and hyphens with spaces
    let label = fieldName.replace(/[_-]/g, ' ');

    // Capitalize the first letter of each word
    label = label.replace(/\b\w/g, c => c.toUpperCase());

    return label;
}

// Apply grouping and aggregation to the data
function applyGroupingAndAggregation(data) {
    console.log('Applying grouping and aggregation to data');

    if (!appState.groupings || appState.groupings.length === 0) {
        console.log('No groupings to apply');
        return data;
    }

    console.log('Groupings to apply:', appState.groupings);
    console.log('Aggregations to apply:', appState.aggregations);

    // Create a map to store the grouped data
    const groupedData = new Map();

    // Group the data
    data.forEach(item => {
        // Create a key based on the grouping fields
        const key = appState.groupings.map(grouping => {
            const value = item[grouping.field];
            return value !== undefined && value !== null ? value : '';
        }).join('|');

        // If the key doesn't exist in the map, create a new group
        if (!groupedData.has(key)) {
            const group = {};

            // Add ONLY the grouping fields to the group
            appState.groupings.forEach(grouping => {
                group[grouping.field] = item[grouping.field];
            });

            // Initialize aggregation values
            if (appState.aggregations && appState.aggregations.length > 0) {
                appState.aggregations.forEach(agg => {
                    group[agg.alias || `${agg.function}_${agg.field}`] = null;
                });
            } else {
                // If no aggregations are defined, add a count aggregation
                group['count'] = 0;
            }

            // Add the group to the map
            groupedData.set(key, group);
        }

        // Get the group
        const group = groupedData.get(key);

        // Increment the count if we're using the default count aggregation
        if (group.hasOwnProperty('count')) {
            group['count']++;
        }

        // Apply aggregations
        if (appState.aggregations && appState.aggregations.length > 0) {
            appState.aggregations.forEach(agg => {
                const value = item[agg.field];
                const aggKey = agg.alias || `${agg.function}_${agg.field}`;

                // Skip if the value is not a number and the aggregation is not count
                if ((value === undefined || value === null || isNaN(Number(value))) && agg.function !== 'count') {
                    return;
                }

                // Apply the aggregation function
                switch (agg.function) {
                    case 'sum':
                        if (group[aggKey] === null) {
                            group[aggKey] = 0;
                        }
                        group[aggKey] += Number(value);
                        break;
                    case 'avg':
                        if (group[aggKey] === null) {
                            group._sum_for_avg = group._sum_for_avg || {};
                            group._sum_for_avg[agg.field] = 0;
                            group._count_for_avg = group._count_for_avg || {};
                            group._count_for_avg[agg.field] = 0;
                        }

                        if (value !== undefined && value !== null && !isNaN(Number(value))) {
                            group._sum_for_avg[agg.field] += Number(value);
                            group._count_for_avg[agg.field]++;
                            group[aggKey] = group._sum_for_avg[agg.field] / group._count_for_avg[agg.field];
                        }
                        break;
                    case 'min':
                        if (group[aggKey] === null || Number(value) < group[aggKey]) {
                            group[aggKey] = Number(value);
                        }
                        break;
                    case 'max':
                        if (group[aggKey] === null || Number(value) > group[aggKey]) {
                            group[aggKey] = Number(value);
                        }
                        break;
                    case 'count':
                        if (group[aggKey] === null) {
                            group[aggKey] = 0;
                        }
                        group[aggKey]++;
                        break;
                }
            });
        }
    });

    // Convert the map to an array
    let result = Array.from(groupedData.values());

    // Remove any internal fields (those starting with underscore)
    result = result.map(item => {
        const cleanItem = {};
        Object.keys(item).forEach(key => {
            if (!key.startsWith('_')) {
                cleanItem[key] = item[key];
            }
        });
        return cleanItem;
    });

    // Sort the result based on the grouping fields
    if (appState.groupings.length > 0) {
        result.sort((a, b) => {
            for (const grouping of appState.groupings) {
                const field = grouping.field;
                const direction = grouping.sortOrder === 'asc' ? 1 : -1;

                const aValue = a[field];
                const bValue = b[field];

                if (aValue === bValue) {
                    continue;
                }

                if (aValue === null || aValue === undefined) {
                    return direction;
                }

                if (bValue === null || bValue === undefined) {
                    return -direction;
                }

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return (aValue - bValue) * direction;
                }

                return String(aValue).localeCompare(String(bValue)) * direction;
            }

            return 0;
        });
    }

    console.log('Grouped data:', result);

    // Create a new array of selected fields that includes all original fields
    // plus any new aggregation fields
    const newSelectedFields = [...appState.selectedFields];

    // Add any aggregation fields that aren't already in the selected fields
    if (appState.aggregations && appState.aggregations.length > 0) {
        appState.aggregations.forEach(agg => {
            const aggKey = agg.alias || `${agg.function}_${agg.field}`;

            // Check if this aggregation field is already in the selected fields
            const exists = newSelectedFields.some(field => field.name === aggKey);

            if (!exists) {
                newSelectedFields.push({
                    name: aggKey,
                    type: 'number',
                    label: agg.alias || `${agg.function} of ${agg.field}`
                });
            }
        });
    } else if (result.length > 0 && result[0].hasOwnProperty('count')) {
        // Add count field if it exists and isn't already in the selected fields
        const exists = newSelectedFields.some(field => field.name === 'count');

        if (!exists) {
            newSelectedFields.push({
                name: 'count',
                type: 'number',
                label: 'Count'
            });
        }
    }

    // Make sure all the fields in the result are represented in the selected fields
    if (result.length > 0) {
        const resultFields = Object.keys(result[0]);

        resultFields.forEach(fieldName => {
            // Skip fields that are already in the selected fields
            const exists = newSelectedFields.some(field => field.name === fieldName);

            if (!exists) {
                // Determine the field type
                const value = result[0][fieldName];
                let type = 'string';

                if (typeof value === 'number') {
                    type = 'number';
                } else if (value instanceof Date) {
                    type = 'date';
                } else if (typeof value === 'boolean') {
                    type = 'boolean';
                }

                newSelectedFields.push({
                    name: fieldName,
                    type: type,
                    label: formatFieldLabel(fieldName)
                });
            }
        });
    }

    // Log the updated selected fields
    console.log('Updated selected fields:', newSelectedFields);

    return result;
}
