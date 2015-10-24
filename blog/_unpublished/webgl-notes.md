Vertex array sent to GPU via vertex buffers
GPU reads vertecies and ran against vertex shader
Vertex shader calculates the projected position of vertex
GPU connects projected vertices to form triangles (sets of 3), in order from array
Rasterizer takes each triangle, clips, discards out of screen parts, breaks remaining to pixel sized fragments
Rasterizer blends clours (gradient)
Generated pixel-sized frags to through fragment shader
Frag shader outputs color + depth in each pixel, which get drawn to framebuffer
Frag shader also do texture mapping and lighting
Framebuffer is final destination
Each pixel in a polygon is called a fragment
Fragment shader establishes pixel color
gl_fragColor built-in GL var used for frag color
vertex shader defins the position and shape of each vertex
you can use a 4x4 matrix to represent 3d object in space



a simple webgl program:
create canvas
obtain context
initialize viewport
create 1+ buffers
create 1+ matrices
create 1+ shaders
init shaders
draw 1+ primitives