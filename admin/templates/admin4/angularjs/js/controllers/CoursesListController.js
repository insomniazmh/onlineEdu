'use strict';

MetronicApp.controller('CoursesListController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        $scope.data = [{
        	title: "html基础教程",
        	sign: "html",
        	bannerList: [{
        		info: "第一课",
        		imageUrl: "../../../assets/admin/pages/media/gallery/image5.jpg"
        	},{
        		info: "第二课",
        		imageUrl: "../../../assets/admin/pages/media/gallery/image2.jpg"
        	},{
        		info: "第三课",
        		imageUrl: "../../../assets/admin/pages/media/gallery/image1.jpg"
        	}]
        }];
        
        var html = 
        	`<div class="col-md-4">
						<div id="myCarousel" class="carousel image-carousel slide">
										<div class="carousel-inner">
											<div class="active item">
												<img src="../../../assets/admin/pages/media/gallery/image5.jpg" class="img-responsive" alt="">
												<div class="carousel-caption">
													<h4>
													<a href="page_news_item.html">
													First Thumbnail label </a>
													</h4>
													<p>
														 Cras justo odio, dapibus ac facilisis in, egestas eget quam.
													</p>
												</div>
											</div>
											<div class="item">
												<img src="../../../assets/admin/pages/media/gallery/image2.jpg" class="img-responsive" alt="">
												<div class="carousel-caption">
													<h4>
													<a href="page_news_item.html">
													Second Thumbnail label </a>
													</h4>
													<p>
														 Cras justo odio, dapibus ac facilisis in, egestas eget quam.
													</p>
												</div>
											</div>
											<div class="item">
												<img src="../../../assets/admin/pages/media/gallery/image1.jpg" class="img-responsive" alt="">
												<div class="carousel-caption">
													<h4>
													<a href="page_news_item.html">
													Third Thumbnail label </a>
													</h4>
													<p>
														 Cras justo odio, dapibus ac facilisis in, egestas eget quam.
													</p>
												</div>
											</div>
										</div>
										<!-- Carousel nav -->
										<a class="carousel-control left" data-target="#myCarousel" data-slide="prev">
										<i class="m-icon-big-swapleft m-icon-white"></i>
										</a>
										<a class="carousel-control right" data-target="#myCarousel" data-slide="next">
										<i class="m-icon-big-swapright m-icon-white"></i>
										</a>
										<ol class="carousel-indicators">
											<li data-target="#myCarousel" data-slide-to="0" class="active">
											</li>
											<li data-target="#myCarousel" data-slide-to="1">
											</li>
											<li data-target="#myCarousel" data-slide-to="2">
											</li>
										</ol>
									</div>	
									<div class="top-news margin-top-10">
										<a href="javascript:;" class="btn blue">
										<span>
										Featured News </span>
										<em>
										<i class="fa fa-tags"></i>
										USA, Business, Apple </em>
										<i class="fa fa- icon-bullhorn top-news-icon"></i>
										</a>
									</div>
						</div>`;
        	
        	$("#aaa").append(html);
    });
});