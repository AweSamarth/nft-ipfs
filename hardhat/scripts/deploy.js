const hre = require("hardhat");

require ("dotenv").config({path:".env"})

async function main(){

  const metadataURL = "ipfs://Qmbygo38DWF1V8GttM1zy89KzyZTPU2FLUzQtiDvB7q6i5"

  const lw3PunksContract = await hre.ethers.deployContract("LW3Punks", [metadataURL])

  await lw3PunksContract.waitForDeployment()

  console.log("LW3Punks Contract Address: ", lw3PunksContract.target)

  
}

main()
.then(()=>process.exit(0))
.catch((error)=>{
  console.error(error)
  process.exit(1)
})

