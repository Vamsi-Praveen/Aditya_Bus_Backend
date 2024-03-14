import BusCount from "../models/busCount.model.js";
import Bus from "../models/buses.model.js";

export const updateBusCount = async (req, res) => {

    const date = new Date().toISOString().split('T')[0].split('-').reverse().join('-').toString();
    const busNumber = req.busNumber;
    const busValid = await Bus.findOne({ busNumber: busNumber });
    if (busValid) {
        let count = await BusCount.findOne({ date: date, busNumber: busNumber });
        if (!count) {
            await BusCount.create({
                busNumber: busNumber,
                date: date,
                scanned_counts: 1
            })
            return;
        }
        count.scanned_counts++;
        await count.save();
        return;
    }
    else {
        return res.status(404).send({ 'message': "Invalid Bus Number" });
    }
}
