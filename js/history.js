var plotDonut = function(correct_num,summary_num){
	var height = 300;
	var width = 300;
	var percentile = Math.round(correct_num / summary_num * 1000)/10;
	
	var oRadius = width/2;
	var iRadius = 100;
	
	var arc = d3.svg.arc()
				.innerRadius(iRadius)
				.outerRadius(oRadius);
	
	var dataset = [correct_num,summary_num-correct_num];
	var pie = d3.layout.pie();
	var pieChart = d3.select('#graph_area')
						.append('svg')
						.attr({
							'width':width,
							'height':height
						});
	var color = ["#20F67D","red"];
	var wedges = pieChart.selectAll('g')
							.data(pie(dataset))
							.enter()
							.append('g')
							.attr({
								'class':'wedge',
								'transform':'translate('+oRadius+','+oRadius+')'
							});
		wedges.append('path')
				.attr({
					'fill':function(d,i){
						return color[i];
					},
					'd':arc,
					'stroke':'white'
				})
				.transition()
				.duration(500)
				.attrTween("d", function(d){
					var interpolate = d3.interpolate(
						{ startAngle : 0, endAngle : 0 },
						{ startAngle : d.startAngle, endAngle : d.endAngle }
					);
					return function(t){
						return arc(interpolate(t));
					}
				});
		if(summary_num == 0){
			wedges.append('text')
					.attr({
						'font-size':'20pt',
						'fill':'black',
						'text-anchor':'middle'
					})
					.text("データはありません。");
		}else{
			wedges.append('text')
					.attr({
						'font-size':'30pt',
						'fill':'black',
						'text-anchor':'middle'
					})
					.text(percentile+"％");
		}
}


var drawBargraph = function(dataset,selector,type){
	var minDate = dataset[0];
	var maxDate = dataset[dataset.length-1];
	$('#description').html('<p><strong>'+minDate.year+'年'+minDate.month+'月'+minDate.day+'日〜'+maxDate.year+'年'+maxDate.month+'月'+maxDate.day+'日の'+type+'履歴</strong></p>');
	$('#tooltip').hide();
	var w = 400;
	var h = 200;
	var margin = {'top':0,'left':30,'right':0,'bottom':30};
	var inw = w - (margin.right + margin.left);
	var inh = h - (margin.top + margin.bottom);
	var xScale = d3.scale
					.ordinal()
					.domain(d3.range(dataset.length))
					.rangeRoundBands([margin.left,inw],0.05);
	var yScale = d3.scale
					.linear()
					.domain([0,d3.max(dataset,function(d){return d.counter;})])
					.range([inh, 0]);
	var xAxis = d3.svg
					.axis()
					.scale(xScale)
					.orient('bottom');
	var yAxis = d3.svg
					.axis()
					.scale(yScale)
					.orient('left');
	var svg = d3.select(selector)
				.append('svg')
				.attr({
					'width':w,
					'height':h
				});
	svg.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr({
			'x': function(d,i){return xScale(i);},
			'y': function(d){return yScale(d.counter);},
			'width': xScale.rangeBand(),
			'height': function(d){return h - yScale(d.counter) - margin.bottom;},
			'fill': 'orange'
		})
		.on('mouseover',function(d){
			$('#description').hide();			
			d3.select('#value')
				.text(d.counter);
			d3.select('#year')
				.text(d.year);
			d3.select('#month')
				.text(d.month);
			d3.select('#day')
				.text(d.day);
			$('#tooltip').show();
		})
		.on('mouseout',function(){
			$('#tooltip').hide();
			$('#description').show();
		});
	svg.append('g')
		.attr({
			'class':'axis',
			'transform':'translate(0,'+(h-margin.bottom)+')'
		})
		.call(xAxis)
		.selectAll('text')
		.data(dataset)
		.text(function(d){
			return d.year+'年';
		})
	svg.append('g')
		.attr({
			'class':'axis',
			'transform':'translate(0,'+(h-margin.bottom)+')'
		})
		.call(xAxis)
		.selectAll('text')
		.data(dataset)
		.text(function(d){
			return d.month+'月'+d.day+'日';
		})
		.attr({
			'dy':'20px'
		});
	svg.append('g')
		.attr({
			'class':'axis',
			'transform':'translate('+margin.left+',0)'
		})
		.call(yAxis);
}