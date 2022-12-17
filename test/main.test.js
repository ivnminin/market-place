const fs = require('fs')
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Main test", function () {

    beforeEach(async function() {
      const signers = await ethers.getSigners();
      this.deployer = signers[0];
      this.lastBuyer = signers[1]
      this.buyers = signers.slice(2);
      
      const tokenFactory = await ethers.getContractFactory("EventToken");
      this.initialSupply = ethers.utils.parseEther("1000000.0");
      this.token = await tokenFactory.deploy(this.initialSupply);

      const tokenSaleFactory = await ethers.getContractFactory("TokenSale");
      this.fundsRequired = ethers.utils.parseEther("99000.0");
      this.tokenSale = await tokenSaleFactory.deploy(
        this.token.address,
        this.fundsRequired,
      );
      await this.token.transfer(this.tokenSale.address, this.fundsRequired);
    })

    it("should have an owner", async function() {
      expect(await this.token.owner()).to.eq(this.deployer.address);
      expect(await this.tokenSale.owner()).to.eq(this.deployer.address);
    })

    it("check correct fundsRequired", async function() {
      expect(await this.tokenSale.fundsRequired()).to.eq(this.fundsRequired);
    })

    it("token sale must have enough funds", async function() {
      expect(await this.token.balanceOf(this.tokenSale.address)).to.eq(this.fundsRequired);
    })
    
    describe("ICO", function () {
      it("tokens must be sold", async function() {
        const buy = async function(buyer, seller, amount) {  
          let txData = {
            value: amount,
            to: seller.address
          };
    
          let tx = await buyer.sendTransaction(txData);
          await tx.wait();
        }

        function randomInteger(min, max) {
          let rand = min - 0.5 + Math.random() * (max - min + 1);
          return Math.round(rand);
        }

        let tokenAmount;
        for (const i in this.buyers) {
          tokenAmount = ethers.utils.parseEther(
            randomInteger(1, 1000).toString()
          );
          await buy(this.buyers[i], this.tokenSale, tokenAmount);
          expect(await this.token.balanceOf(this.buyers[i].address)).to.eq(tokenAmount);
        }
        const remain = await this.token.balanceOf(this.tokenSale.address);
        await buy(this.lastBuyer, this.tokenSale, remain);
        expect(await this.token.balanceOf(this.lastBuyer.address)).to.eq(remain);
        expect(await this.token.balanceOf(this.tokenSale.address)).to.eq(0);
        
//        await expect(this.lastBuyer.sendTransaction(
//          {
//            value: 1,
//            to: this.tokenSale.address
//          }
//        )).to.be.revertedWith("sold out")
      })

      it("save contracts address", async function() {
        const contracts = {
          token: this.token.address,
          token_sale: this.tokenSale.address,
        }
        const data = JSON.stringify(contracts)
        fs.writeFile('contracts.json', data, err => {
          if (err) {
            throw err
          }
          console.log('JSON data is saved.')
        })
      })
    });
})
