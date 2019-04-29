from flask import Flask, url_for, render_template, request, make_response, Markup
from flask_sslify import SSLify
import usedb

app = Flask(__name__)
sslify = SSLify(app)

# This will be our splash page
@app.route('/')
def splash():
    return render_template('hello.html')

# This is our main map page
@app.route('/map', methods = ['GET', 'POST'])
def map():
    if request.method == 'GET':
        objects = usedb.json_objects_table('artobjects.db')
        return render_template('map.html', objects=objects)
    elif request.method == 'POST':
        lat = float(request.form.get('lat'))
        lng = float(request.form.get('lng'))
        closestObjects = usedb.display_objects_location('artobjects.db', lat, lng, 5)
        return closestObjects

   
@app.route('/search', methods = ['GET', 'POST'])
def search():
    if request.method == 'POST':

    return render_template('search.html')

# However we're going to display the full data about an object
@app.route('/objects/<int:obj_id>')
def show_object_data(obj_id):
    objdata = usedb.display_object_data('artobjects.db', obj_id)
    return render_template('objects.html', objdata=objdata)


