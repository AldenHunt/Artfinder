from flask import Flask, url_for, render_template, request, make_response
app = Flask(__name__)

# This will be our splash page
@app.route('/')
def splash():
    return render_template('hello.html')

# This is our main map page
@app.route('/map')
def map():
    return render_template('map.html')

# However we're going to display the full data about an object
@app.route('/objects/<int:obj_id>')
def show_object_data(obj_id):
    return 'ID: %s' % obj_id


