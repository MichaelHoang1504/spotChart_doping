let width = 800;
let height = 600;
let padding = 80;

let svgSpotChart= d3.select('.chart')
                   .append('svg')
                   .attr('width',width)
                   .attr('height',height)
let tooltip = d3.select('.chart')
                .append('div')
                .attr('id','tooltip')
                .style('opacity',0);
fetch( 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then(response=> response.json())
.then(data => {
  svgSpotChart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -250)
      .attr('y', 40)
      .style('font-size', 18)
      .text('Time');
  svgSpotChart.append('text')
      .attr('x', (width-padding)/2)
      .attr('y', height - 40)
      .style('font-size', 18)
      .text('Year');
  let year = data.map( d => {
      return d['Year'];
    });
  let yearMax = d3.max(year);
  let yearMin = d3.min(year);
  console.log(yearMax);
  let xScale = d3.scaleLinear()
  .domain([yearMin-1,yearMax+1])
  .range([padding, width-padding]);
  let seconds = data.map(d=> d.Seconds);
  let secondMax = new Date(d3.max(seconds)*1000);
  let secondMin = new Date(d3.min(seconds)*1000);
  let timeFormat = d3.timeFormat('%M:%S');
  let yScale = d3.scaleTime()
  .domain([secondMin,secondMax])
  .range([padding,height-padding]);
  let xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'));
  let yAxis = d3.axisLeft(yScale)
                 .tickFormat(timeFormat);
  
  svgSpotChart.append('g')
              .call(xAxis)
              .attr('id', 'x-axis')
              .attr('transform', 'translate(0, '+ (height - padding) + ')')
  svgSpotChart.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
  
  svgSpotChart.selectAll('circle')
              .data(data)
              .enter()
              .append('circle')
              .attr('class', 'dot')
              .attr('r', '5')
              .attr('data-xvalue', d => {
                  return d['Year'];
  })
              .attr('data-yvalue', d => {
                  return new Date(d['Seconds'] * 1000);
  })
              .attr('cx', d => {
                return xScale(d['Year']);
  })
              .attr('cy', d => {
                return yScale(new Date(d['Seconds'] *1000))
    ;
  })
              .attr('fill', d=> d['Doping'] != ''?'#2596be' : '#Be6a25')
    .on('mouseover', (event,d)=> {
        tooltip.style('opacity', 0.9);
        tooltip.attr('data-year', d['Year']);
        tooltip
          .html(
            d['Name'] +
              ': ' +
              d['Nationality'] +
              '<br/>' +
              'Year: ' +
              d['Year'] +
              ', Time: ' +
              timeFormat(d['Seconds']*1000) +
              (d['Doping'] ? '<br/><br/>' + d['Doping'] : '')
          )
          .style('left', event.pageX +150 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0);
      });
  let legendContainer = svgSpotChart.append('g')
                            .attr('id', 'legend');
  let legend = legendContainer
      .selectAll('#legend')
      .data(['#2596be','#Be6a25'])
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', function (d, i) {
        return 'translate(0,' + (height / 2 - i * 20) + ')';
      });
  legend
      .append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', d=> d);
  legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function (d,i) {
        if (i==0) {
          return 'Doping Allegations';
        } else {
          return 'No Doping Allegations';
        }
      });
       
}).catch(e => console.log(e));
  