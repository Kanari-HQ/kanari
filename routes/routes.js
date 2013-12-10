
/*
 * GET home page.
 */

//@kamlearn: what are exports here
exports.index = function(req, res){
  res.render('index', { title: 'Kanari' });
};


/*
 * GET about page.
 */

exports.about = function(req, res){
    res.render('index', { title: 'About' })
};