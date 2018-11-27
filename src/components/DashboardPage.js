import React from 'react';
import FilterExpansionsModule from './FilterExpansionsModule';
import TableModule from './TableModule';

export default class DashboardPage extends React.Component {
    render() {
        return (
            <div>
                <FilterExpansionsModule />
                <TableModule />
            </div>
        );
    }
}