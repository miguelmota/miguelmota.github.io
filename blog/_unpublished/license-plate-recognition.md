brew install tesseract --devel

brew install cmake

brew tap homebrew/science

brew install opencv

brew install log4cplus

# Clone the latest code from GitHub
git clone https://github.com/openalpr/openalpr.git

# Setup the build directory
cd openalpr/src
mkdir build
cd build

# setup the compile environment
cmake -DCMAKE_INSTALL_PREFIX:PATH=/usr -DCMAKE_INSTALL_SYSCONFDIR:PATH=/etc ..

# compile the library
make

# Install the binaries/libraries to your local system (prefix is /usr)
sudo make install

# Test the library
wget http://easy-clan.com/ski/pics/license_plate.JPG -O lp.jpg
alpr lp.jpg

alpr ~/image.png -j
