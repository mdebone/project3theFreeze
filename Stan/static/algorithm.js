// Time
var dataTime = d3.range(0, 129).map(function(d) {
    return new Date(2021, 2, 14, 15+d);
  });

var dataTimeTicks=d3.range(0, 5).map(function(d) {
    return new Date(2021, 2, 15+d, 0);
  });
  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(1000 * 60 * 60 )
    .width(400)
    .ticks(6)
    .tickFormat(d3.timeFormat('%d'))
    .tickValues(dataTimeTicks)
    .default(new Date(2021, 2, 15, 15))
    .on('onchange', val => {
      d3.select('p#value-time').text(d3.timeFormat('%d-%H')(val));
    });

  var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gTime.call(sliderTime);

  d3.select('p#value-time').text(d3.timeFormat('%d-%H')(sliderTime.value()));

   // New York Times
   var width = 565;
   var height = 120;
   var margin = { top: 20, right: 50, bottom: 50, left: 40 };
 
   var dataNewYorkTimes = d3.range(1, 41).map(d => ({
     year: d,
     value: 10000 * Math.exp(-(d - 1) / 40),
   }));
 
   var svg = d3
     .select('div#slider-new-york-times')
     .append('svg')
     .attr('width', width)
     .attr('height', height);
 
   var padding = 0.1;
 
   var xBand = d3
     .scaleBand()
     .domain(dataNewYorkTimes.map(d => d.year))
     .range([margin.left, width - margin.right])
     .padding(padding);
 
   var xLinear = d3
     .scaleLinear()
     .domain([
       d3.min(dataNewYorkTimes, d => d.year),
       d3.max(dataNewYorkTimes, d => d.year),
     ])
     .range([
       margin.left + xBand.bandwidth() / 2 + xBand.step() * padding - 0.5,
       width -
         margin.right -
         xBand.bandwidth() / 2 -
         xBand.step() * padding -
         0.5,
     ]);
 
   var y = d3
     .scaleLinear()
     .domain([0, d3.max(dataNewYorkTimes, d => d.value)])
     .nice()
     .range([height - margin.bottom, margin.top]);
 
   var yAxis = g =>
     g
       .attr('transform', `translate(${width - margin.right},0)`)
       .call(
         d3
           .axisRight(y)
           .tickValues([1e4])
           .tickFormat(d3.format('($.2s'))
       )
       .call(g => g.select('.domain').remove());
 
   var slider = g =>
     g.attr('transform', `translate(0,${height - margin.bottom})`).call(
       d3
         .sliderBottom(xLinear)
         .step(1)
         .ticks(8)
         .default(9)
         .on('onchange', value => draw(value))
     );
 
   var bars = svg
     .append('g')
     .selectAll('rect')
     .data(dataNewYorkTimes);
 
   var barsEnter = bars
     .enter()
     .append('rect')
     .attr('x', d => xBand(d.year))
     .attr('y', d => y(d.value))
     .attr('height', d => y(0) - y(d.value))
     .attr('width', xBand.bandwidth());
 
   svg.append('g').call(yAxis);
   svg.append('g').call(slider);
   
   svg.select('.track-overlay').attr('stroke-width', 120); // Ensure drag zone covers everything
 
   var draw = selected => {
     barsEnter
       .merge(bars)
       .attr('fill', d => (d.year === selected ? '#bad80a' : '#e0e0e0'));
 
     d3.select('p#value-new-york-times').text(
       d3.format('$,.2r')(dataNewYorkTimes[selected - 1].value)
     );
   };
 
   draw(9);
 