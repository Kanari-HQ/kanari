
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Kanari' });
};


/*
 * GET about page.
 */

exports.about = function(req, res){
    res.render('index', { title: 'About' })
};