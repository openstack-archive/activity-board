#! /usr/bin/env python
# Copyright (C) 2014 Bitergia

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import argparse

def get_arguments():
    parser = argparse.ArgumentParser(description='Parse HTML generator arguments')
    parser.add_argument('--template', dest='template_file', help='Template file name')
    parser.add_argument('--content', dest='content_file', help='Content file name')

    args = parser.parse_args()
    #print args.accumulate(args.integers)
    return args

if __name__ == "__main__":

    text = "REPLACE_HERE"
    
    arg = get_arguments()
    fd = open(arg.template_file, "r")
    template = fd.read()
    fd.close()

    fd2 = open(arg.content_file, "r")
    body = fd2.read()
    fd2.close()

    template = template.replace(text, body)
    print template
    
    


    
