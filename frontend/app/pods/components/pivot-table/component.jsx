import React from 'npm:react';
import PivotTableUI from 'npm:react-pivottable/PivotTableUI';
import TableRenderers from 'npm:react-pivottable/TableRenderers';
//import Plot from 'npm:react-plotly.js';
import createPlotlyRenderers from 'npm:react-pivottable/PlotlyRenderers';
import createPlotlyComponent from 'npm:react-plotly.js/factory';

// create Plotly renderers via dependency injection
const Plot = createPlotlyComponent(window.Plotly);
const PlotlyRenderers = createPlotlyRenderers(Plot);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.resultsViewSettings;
        this.setData();
    }

    setData(){
        this.data = []
        if (this.props.results && this.props.results.rows){
          this.props.results.rows.forEach((row)=>{
            let obj = {}
            this.props.results.columns.forEach((col, i)=>{
              obj[col] = row[i]
            })
            this.data.push(obj)
          })
        }
    }

    setStateAndSendProps(s){
      this.setState(s);
      this.props.setState(s, this.props.context);
    }

    render() {
        return (
          <div className="pivot-table">
            <PivotTableUI
                data={this.data}
                cols = {this.props.cols || []}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                onChange={s =>
                  this.setStateAndSendProps(s) }
                {...this.state}
            />
        </div>
        );
    }
}
