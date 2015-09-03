#!/usr/bin/env python3

from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash

app = Flask(__name__)
app.config.from_object(__name__)

@app.route('/')
def index():
    return render_template('app.html')

if __name__ == '__main__':
    app.run()