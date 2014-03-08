var drawPercentilegraph = function(dataset,selector){
	var w = 400;
	var h = 250;
	var margin = {'top':10,'left':40,'right':0,'bottom':30};
	var inw = w - (margin.right + margin.left);
	var inh = h - (margin.top + margin.bottom);
	var formatPercent = d3.format('.0%')
	var xScale = d3.scale
					.ordinal()
					.domain(d3.range(dataset.length))
					.rangeRoundBands([margin.left,inw],0.2);
	var yScale = d3.scale
					.linear()
					.domain([0,1])
					.range([inh, margin.top]);
	var xAxis = d3.svg
					.axis()
					.scale(xScale)
					.orient('bottom');
	var yAxis = d3.svg
					.axis()
					.scale(yScale)
					.orient('left')
					.ticks(10)
					.tickFormat(formatPercent);
	var tip = d3.tip()
				.attr('class','d3-tip')
				.offset([-10,0])
				.html(function(d){
					return '<strong>'+Math.round(d.percentile*1000)/10+'％</strong>('+d.summary+'問中'+d.correct+'問正解)';
				});
	var svg = d3.select(selector)
				.append('svg')
				.attr({
					'width':w,
					'height':h
				});
	svg.call(tip);
	svg.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr({
			'x': function(d,i){return xScale(i);},
			'y': function(d){return yScale(d.percentile);},
			'width': xScale.rangeBand(),
			'height': function(d){return h - yScale(d.percentile) - margin.bottom - margin.top;},
			'fill': 'orange'
		})
		.on('mouseover',tip.show)
		.on('mouseout',tip.hide)
	svg.append('g')
		.attr({
			'class':'axis',
			'transform':'translate(0,'+(h-margin.bottom-margin.top)+')'
		})
		.call(xAxis)
		.selectAll('text')
		.data(dataset)
		.text(function(d){
			return d.start_month+'月'+d.start_day+'日〜';
		});
	svg.append('g')
		.attr({
			'class':'axis',
			'transform':'translate('+margin.left+',0)'
		})
		.call(yAxis);
}